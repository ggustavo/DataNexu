import psycopg2
from data_nexus.log_handle.log import *

class PostgreSQLConnection:
    def __init__(self, db_credentials):
        self.db_credentials = db_credentials
        self.connection = None
        self.database = db_credentials.database
        self.schema = db_credentials.schema
        
    def create(self):
        try:
            self.connection = psycopg2.connect(
                dbname=self.db_credentials.database,
                user=self.db_credentials.user,
                password=self.db_credentials.password,
                host=self.db_credentials.host,
                port=self.db_credentials.port
            )
            log_debug("PostgreSQL connection created successfully.")
        except Exception as e:
            log_error(f"Error creating PostgreSQL connection: {e}")
            raise e

    def close(self):
        if self.connection:
            try:
                self.connection.close()
                log_debug("PostgreSQL connection closed.")
                self.connection = None
            except Exception as e:
                log_error(f"Error closing PostgreSQL connection: {e}")
                raise e
