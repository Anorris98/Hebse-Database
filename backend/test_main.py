from unittest.mock import patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool
from main import app


# Create a TestClient instance
client = TestClient(app)
#Mock SQLAlchemy engine
engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
with engine.connect() as connection:
    connection.execute(text("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)"))
    connection.execute(text("INSERT INTO users (id, name) VALUES (1, 'Test')"))
    connection.execute(text("INSERT INTO users (id, name) VALUES (2, 'Test2')"))
    connection.commit()


@patch('main.engine', new=engine)
def test_get_data_successful_query():
    # Define a sample request body with a valid query
    request_body = {
        "query": "SELECT * FROM users",
        "history": True
    }

    response = client.post("/GetData", json=request_body)

    assert response.status_code == 200

    expected_response = [{"id": 1, "name": "Test"}, {"id": 2, "name": "Test2"}]
    assert response.json()["data"] == expected_response

def test_get_data_invalid_request():
    # Define a request body without the 'query' key
    request_body = {}

    response = client.post("/GetData", json=request_body)

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Query key is required."
    }

@patch('main.engine', new=engine)
def test_get_data_error_executing_query():
    # Define a sample request body with an invalid query
    request_body = {
        "query": "SELECT * FROM non_existent_table"  # Invalid table name
    }

    response = client.post("/GetData", json=request_body)
    assert response.status_code == 500
    error_message = response.json()["detail"].split("\n")[0]
    print(error_message)
    assert error_message == "(sqlite3.OperationalError) no such table: non_existent_table"

@patch('main.engine', new=None)
def test_get_data_no_engine():
    request_body = {
        "query": "SELECT * FROM users"
    }

    response = client.post("/GetData", json=request_body)

    assert response.status_code == 500
    assert response.json() == {
        "detail": "Database engine not initialized."
    }

def test_ask_gpt_no_query():
    request_body = {}
    response = client.post("/ask_gpt", json=request_body)
    assert response.status_code == 400
    assert response.json() == {
        "detail": "Query is required."
    }

def test_ask_gpt_no_settings():
    request_body = {
        "query": "Give me the average radius of the final profile"
    }
    response = client.post("/ask_gpt", json=request_body)
    assert response.status_code == 400
    assert response.json() == {
        "detail": "GPT API key is missing."
    }

@patch('main.configure_engine_from_settings')
def test_configure_engine(mock_configure_engine):
    mock_configure_engine.return_value = "success"
    request_body = {}
    response = client.post("/ConfigureEngine", json=request_body)

    assert response.status_code == 200
    assert response.json() == {
        "detail": "Engine configured from settings."
    }

@patch('main.configure_engine_from_settings')
def test_configure_engine_error(mock_configure_engine):
    mock_configure_engine.side_effect = Exception("Failed to initialize database")
    request_body = {}
    response = client.post("/ConfigureEngine", json=request_body)
    assert response.status_code == 500
    assert response.json() == {
        "detail": "Failed to initialize database"
    }