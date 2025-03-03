from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from main import app


# Create a TestClient instance
client = TestClient(app)
#Mock SQLAlchemy engine
engine = create_engine("sqlite:///:memory:")


def test_get_data_successful_query():
    # Define a sample request body with a valid query
    request_body = {
        "query": "SELECT * FROM users"
    }
    # Mock the database connection and execution
    with engine.connect() as connection:
        # Create a table and insert mock data
        connection.execute(text("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)"))
        connection.execute(text("INSERT INTO users (id, name) VALUES (1, 'Test')"))

        # Execute the query
        query_result = connection.execute(text(request_body["query"])).fetchall()
        
        # Convert result to dictionary format for comparison
        result_data = [{"id": row[0], "name": row[1]} for row in query_result]

        # Mocked data response
        expected_response = [{"id": 1, "name": "Test"}]

        # Perform assertions
        assert result_data == expected_response

def test_get_data_invalid_request():
    # Define a request body without the 'query' key
    request_body = {}

    response = client.post("/GetData", json=request_body)

    assert response.status_code == 400
    assert response.json() == {
        "detail": "Invalid request. 'query' key is required in the body."
    }

def test_get_data_error_executing_query():
    # Define a sample request body with an invalid query
    request_body = {
        "query": "SELECT * FROM non_existent_table"  # Invalid table name
    }
    
    response = client.post("/GetData", json=request_body)
    assert response.status_code == 500
    error_message = response.json()["detail"].split("\n")[0]
    print(error_message)
    assert error_message == "Error executing query: (psycopg2.errors.UndefinedTable) relation \"non_existent_table\" does not exist"