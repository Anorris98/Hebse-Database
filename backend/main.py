from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from openai import OpenAI
import sshtunnel
import traceback

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

@app.post("/GetData")
def get_data(body: dict):
    raw_query = body.get("query")
    if not raw_query:
        raise HTTPException(status_code=400, detail="Query key is required.")

    try:
        with engine.connect() as connection:
            result = connection.execute(text(raw_query))
            rows = [row._mapping for row in result]
            return {"message": "Query executed successfully.", "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask_gpt")
def ask_gpt(request: dict):
    client = OpenAI()
    user_query = request.get("query")
    settings = request.get("settings")
    if not user_query:
        raise HTTPException(status_code=400, detail="Query is required.")
    if not settings or "apiKey" not in settings:
        raise HTTPException(status_code=400, detail="GPT API key is missing.")

    try:
        client.api_key = settings["apiKey"]
        response = client.chat.completions.create(
            model=settings.get("model", "gpt-4o-mini"),
             messages=[
                {"role": "system", "content": "You are NLP assistant used for helping to user generate a query and nothing more."},
                {"role": "user", "content": user_query}
            ],
             max_completion_tokens=int(settings.get("max_tokens", 0))
        )
        return {"response": response.choices[0].message}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
