import mysql.connector
from data_nexus.log_handle.log import *

class MySQLConnection:
    def __init__(self, db_credentials):
        self.db_credentials = db_credentials
        self.connection = None
        self.database = db_credentials.database

    def create(self):
        try:
            self.connection = mysql.connector.connect(
                database=self.db_credentials.database,
                user=self.db_credentials.user,
                password=self.db_credentials.password,
                host=self.db_credentials.host,
                port=self.db_credentials.port
            )
            log_debug("MySQL connection created successfully.")
        except Exception as e:
            log_error(f"Error creating MySQL connection: {e}")
            raise e

    def close(self):
        if self.connection:
            try:
                self.connection.close()
                log_debug("MySQL connection closed.")
                self.connection = None
            except Exception as e:
                log_error(f"Error closing MySQL connection: {e}")
                raise e
     