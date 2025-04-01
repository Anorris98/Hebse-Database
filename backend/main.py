import traceback
import csv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, text, MetaData
from openai import OpenAI
import sshtunnel

# Create one FastAPI instance
app = FastAPI()

# Configure CORS middleware
origins = ["http://localhost", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup SSH tunnel and database connection
tunnel = sshtunnel.SSHTunnelForwarder(
    ("SDmay25-20.ece.iastate.edu", 22),
    ssh_username="vm-user",
    ssh_password="50EgMe$KIE2m",
    allow_agent=False,  # Prevents using SSH agent keys
    host_pkey_directories=[],  # Ignores default SSH keys
    ssh_private_key=None,  # Explicitly prevent key authentication
    remote_bind_address=("127.0.0.1", 5432)
)
tunnel.start()

DATABASE_CONFIG = {
    "username": "postgres",
    "password": "root",
    "host": "localhost",
    "port": tunnel.local_bind_port,
    "database": "hades"
}
DB_URL = (
    f"postgresql+psycopg2://{DATABASE_CONFIG['username']}:"
    f"{DATABASE_CONFIG['password']}@{DATABASE_CONFIG['host']}:"
    f"{DATABASE_CONFIG['port']}/{DATABASE_CONFIG['database']}"
)
engine = create_engine(DB_URL)
metadata = MetaData()
metadata.reflect(bind=engine)

@app.post("/GetData")
def get_data(body: dict):
    raw_query = body.get("query")
    history = body.get("history", False)
    if not raw_query:
        raise HTTPException(status_code=400, detail="Query key is required.")

    try:
        with engine.connect() as connection:
            result = connection.execute(text(raw_query))
            rows = [row._mapping for row in result]

            if(not history):
                log_query = text("INSERT INTO history.completed_queries (query_sql) VALUES (:query)")
                connection.execute(log_query, {"query": raw_query})
                connection.commit()

            create_csv(rows)
            return {"message": "Query executed successfully.", "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@app.post("/ask_gpt")
def ask_gpt(request: dict):
    user_query = request.get("query")
    settings = request.get("settings")

    if not user_query:
        raise HTTPException(status_code=400, detail="Query is required.")
    if not settings or "apiKey" not in settings:
        raise HTTPException(status_code=400, detail="GPT API key is missing.")

    try:
        # Create the OpenAI client with the API key from the frontend
        client = OpenAI(api_key=settings["apiKey"])

        response = client.chat.completions.create(
            model=settings.get("model", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": "You are an NLP assistant that helps users generate queries "\
                 "for a PostgreSQL database. If a user requests a query, you should respond with the query "\
                 "and the query alone. Do not add any additional formatting or text. Always put quotation "\
                 "marks around column names. If there is no query that both fits the schema and follows the "\
                 "request, inform the user and do not send a query. Make sure each column has a unique name "\
                 f"to be returned. The schema is as follows: {metadata.tables}"},
                {"role": "user", "content": user_query}
            ],
            max_tokens=int(settings.get("max_tokens", 1000))  # Default to 1000 if not provided
        )

        return {"response": response.choices[0].message}  # Correct content extraction
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e)) from e
    
def create_csv(returned_data):
    with open("query_results.csv", mode='w', newline='', encoding='utf=8') as file:
        writer = csv.writer(file)
        writer.writerow(returned_data[0].keys())
        for row in returned_data:
            writer.writerow(row.values())
    
@app.get("/exportData")
def exportData():
    file_name = "query_results.csv"
    #create_csv()
    return FileResponse(file_name, media_type='text/csv', filename="query_results.csv")

@app.get("/getHistory")
def get_history():
    try:
        with engine.connect() as connection:
            query = text(
                'SELECT * FROM "history"."completed_queries" ORDER BY time DESC LIMIT 20'
            )
            result = connection.execute(query)
            queries = [row._mapping for row in result]

            return {"recent_queries": queries}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch recent queries")
    