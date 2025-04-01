import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def init_engine_once():
    """
    Runs only once for all tests. Calls /ConfigureEngine with the 
    needed config for your test DB environment. This ensures the 
    engine is actually created in main.py BEFORE other tests run.
    """
    # Example config (adjust to match your real local/remote DB scenario).
    # If you're using a tunnel or remote, set "isRemote"=True, etc.
    test_config = {
        "sshHost": "SDmay25-20.ece.iastate.edu",
        "sshPort": 22,
        "sshUser": "vm-user",
        "sshKey": "50EgMe$KIE2m",  # Password or private key
        "isRemote": True,
        "dbHost": "SDmay25-20.ece.iastate.edu",
        "dbPort": "5432",
        "dbUsername": "postgres",
        "dbPassword": "root",
        "dbName": "hades"
    }

    # POST the config to /ConfigureEngine
    response = client.post("/ConfigureEngine", json=test_config)
    assert response.status_code == 200, f"Config failed: {response.json()}"
    print("Engine configured response:", response.json())

    yield  # After all tests, no teardown necessary here

def test_get_data_invalid_request():
    # Define a request body without the 'query' key
    request_body = {}
    response = client.post("/GetData", json=request_body)
    assert response.status_code == 400
    assert response.json() == {
        "detail": "Query key is required."
    }

def test_get_data_error_executing_query():
    # Define a sample request body with an invalid query
    request_body = {
        "query": "SELECT * FROM non_existent_table"  # Invalid table name
    }
    response = client.post("/GetData", json=request_body)
    assert response.status_code == 500

    # Make sure it’s still returning a psycopg2 error for a missing table:
    error_message = response.json()["detail"].split("\n")[0]
    print(error_message)
    assert error_message == "(psycopg2.errors.UndefinedTable) relation \"non_existent_table\" does not exist"
