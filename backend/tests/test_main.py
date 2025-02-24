from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
import os
import sshtunnel

import unittest

class TestQuery(unittest.TestCase):
        def test_get_data(self):
                #generate connection to database. Might refactor this into a function (as well in main)
                app = FastAPI()
                
                origins = [
                "http://localhost",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
                ]

                tunnel = sshtunnel.SSHTunnelForwarder(
                ("SDmay25-20.ece.iastate.edu", 22),
                ssh_username="vm-user",
                ssh_password="50EgMe$KIE2m",
                remote_bind_address=("127.0.0.1", 5432)
                )

                tunnel.start()

                # Add CORS middleware
                origins = ["http://localhost", "http://localhost:5173"]
                app.add_middleware(
                CORSMiddleware,
                allow_origins=origins,
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"],
                )
                # PostgreSQL connection configuration
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
                
                #Test actually starts here
                expected = [] #expected result
                try:
                        with engine.connect() as connection:
                                print("Executing query...")  # Log query execution start
                                result = connection.execute(text(raw_query))

                                # Log the raw SQLAlchemy result object
                                #print(f"Raw result: {result}")

                                rows = [row._mapping for row in result]  # Convert rows
                                
                                self.assertEqual(rows, expected)
__name__ == '__main__':
        unittest.main()
                                


                                
