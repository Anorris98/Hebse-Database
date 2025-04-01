import traceback
import csv
from io import StringIO
import sshtunnel
import paramiko
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, text, MetaData
from openai import OpenAI


# Engine / SSH tunnel / schema metadata
engine = None
tunnel = None
metadata = MetaData()

app = FastAPI()

# -------------------------------------------------
# Old Settings for refrence when setting up the database in the application
# -------------------------------------------------
# # Setup SSH tunnel and database connection
# tunnel = sshtunnel.SSHTunnelForwarder(
#     ("SDmay25-20.ece.iastate.edu", 22),
#     ssh_username="vm-user",
#     ssh_password="50EgMe$KIE2m",
#     allow_agent=False,  # Prevents using SSH agent keys
#     host_pkey_directories=[],  # Ignores default SSH keys
#     ssh_private_key=None,  # Explicitly prevent key authentication
#     remote_bind_address=("127.0.0.1", 5432)
# )
# tunnel.start()

# DATABASE_CONFIG = {
#     "username": "postgres",
#     "password": "root",
#     "host": "localhost",
#     "port": tunnel.local_bind_port,
#     "database": "hades"
# }


# -------------------------------------------------
# CORS
# -------------------------------------------------
origins = ["http://localhost", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Decide how to open an SSH tunnel or connect local
#   - databaseHost, databasePort, databaseUsername, databasePassword, databaseName
#   - isRemote, sshHost, sshPort, sshUser, sshKey
#
# If "isRemote" is true, we attempt an SSH tunnel:
#   1) If "sshKey" looks like a private key (-----BEGIN),
#      parse and use that as ssh_pkey
#   2) Otherwise, treat sshKey as a password
# -------------------------------------------------
def configure_engine_from_settings(config: dict):
    global engine, tunnel # pylint: disable=global-statement

    # If we already have a tunnel, stop it before reconfiguring
    if tunnel is not None and tunnel.is_active:
        tunnel.stop()
        tunnel = None

    if config.get("isRemote"):
        # Prepare SSH connection details
        ssh_host = config["sshHost"]
        ssh_port = int(config["sshPort"])
        ssh_user = config["sshUser"]
        # The DB is hosted on remote side, so "databasePort" is the remote DB port
        remote_db_port = int(config["databasePort"])

        # "sshKey" might be a private key OR a password
        ssh_key_text = config.get("sshKey", "")

        # Heuristic: If the text starts with a private key header,
        # treat it as an SSH key. Otherwise, treat as a password.
        if "-----BEGIN" in ssh_key_text:
            # Private key-based SSH
            pkey = paramiko.RSAKey.from_private_key(StringIO(ssh_key_text))
            tunnel_obj = sshtunnel.SSHTunnelForwarder(
                (ssh_host, ssh_port),
                ssh_username=ssh_user,
                ssh_pkey=pkey,
                remote_bind_address=("127.0.0.1", remote_db_port),
            )
        else:
            # Password-based SSH
            tunnel_obj = sshtunnel.SSHTunnelForwarder(
                (ssh_host, ssh_port),
                ssh_username=ssh_user,
                ssh_password=ssh_key_text,
                remote_bind_address=("127.0.0.1", remote_db_port),
            )

        tunnel_obj.start()
        tunnel = tunnel_obj
        # Overwrite host/port so we connect locally to the tunnel
        db_host = "localhost"
        db_port = tunnel.local_bind_port
    else:
        # Local / direct DB
        db_host = config["databaseHost"]
        db_port = config["databasePort"]

    db_username = config["databaseUsername"]
    db_password = config["databasePassword"]
    db_name = config["databaseName"]

    # Build SQLAlchemy connection URL
    db_url = (
        f"postgresql+psycopg2://{db_username}:{db_password}"
        f"@{db_host}:{db_port}/{db_name}"
    )

    # Create engine and reflect schema
    engine = create_engine(db_url)
    metadata.reflect(bind=engine)

# -------------------------------------------------
# Init DB route
# -------------------------------------------------
@app.post("/init_db")
def init_db(body: dict):
    db_config = body.get("db_settings")
    if not db_config:
        raise HTTPException(status_code=400, detail="Missing db_settings")

    try:
        configure_engine_from_settings(db_config)
        return {"message": "Database engine initialized."}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to initialize DB: {e}") from e

# -------------------------------------------------
# Run a query
# -------------------------------------------------
@app.post("/GetData")
def get_data(body: dict):
    raw_query = body.get("query")
    if not raw_query:
        raise HTTPException(status_code=400, detail="Query key is required.")
    if engine is None:
        raise HTTPException(status_code=500, detail="Database engine not initialized.")

    try:
        with engine.connect() as connection:
            result = connection.execute(text(raw_query))
            rows = [row._mapping for row in result]
            create_csv(rows)
            return {"message": "Query executed successfully.", "data": rows}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e)) from e

# -------------------------------------------------
# Ask GPT
# -------------------------------------------------
@app.post("/ask_gpt")
def ask_gpt(request: dict):
    user_query = request.get("query")
    settings = request.get("settings")

    if not user_query:
        raise HTTPException(status_code=400, detail="Query is required.")
    if not settings or "apiKey" not in settings:
        raise HTTPException(status_code=400, detail="GPT API key is missing.")

    try:
        client = OpenAI(api_key=settings["apiKey"])

        response = client.chat.completions.create(
            model=settings.get("model", "gpt-4o-mini"),
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an NLP assistant that helps users generate queries "
                        "for a PostgreSQL database. If a user requests a query, you "
                        "should respond with the query and the query alone. Do not "
                        "add any additional formatting or text. Always put quotation "
                        "marks around column names. If there is no query that both "
                        "fits the schema and follows the request, inform the user "
                        "and do not send a query. Make sure each column has a unique "
                        f"name to be returned. The schema is as follows: {metadata.tables}"
                    ),
                },
                {"role": "user", "content": user_query},
            ],
            max_tokens=int(settings.get("max_tokens", 1000))  # default=1000
        )

        return {"response": response.choices[0].message}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e)) from e

# -------------------------------------------------
# Config Engine Endpoint, used for setting up the engine to be tested in tox
# -------------------------------------------------
@app.post("/ConfigureEngine")
def configure_engine_api(config: dict):
    try:
        configure_engine_from_settings(config)
        return {"detail": "Engine configured from settings."}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

# -------------------------------------------------
# Write query results to CSV
# -------------------------------------------------
def create_csv(returned_data):
    with open("query_results.csv", mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(returned_data[0].keys())
        for row in returned_data:
            writer.writerow(row.values())

# -------------------------------------------------
# Download CSV
# -------------------------------------------------
@app.get("/exportData")
def exportData():
    file_name = "query_results.csv"
    return FileResponse(file_name, media_type="text/csv", filename="query_results.csv")
