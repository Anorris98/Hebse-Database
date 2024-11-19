# this file is for dropping all the current tables in the database. Can be used to ensure a fresh start when uploading new data.
# Currently, Set Up for a database called hades, with the username postgres and password root. Change these values to match your database. Directory is matching my current for data.

from sqlalchemy import create_engine, MetaData
import psycopg2

# PostgreSQL credentials
username = 'postgres'
password = 'root'
host = 'localhost'
port = '5432'
database = 'hades'

# Connect to PostgreSQL using psycopg2
connection = psycopg2.connect(
    user=username,
    password=password,
    host=host,
    port=port,
    database=database
)

connection.autocommit = True
cursor = connection.cursor()

# Get all table names
cursor.execute("""
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public';
""")
tables = cursor.fetchall()

# Drop each table
for table in tables:
    table_name = table[0]
    try:
        print(f"Dropping table: {table_name}")
        cursor.execute(f"DROP TABLE IF EXISTS \"{table_name}\" CASCADE;")
    except Exception as e:
        print(f"Failed to drop table {table_name} due to: {e}")

# Close connection
cursor.close()
connection.close()

print("All tables dropped successfully.")
