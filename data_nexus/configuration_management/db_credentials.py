import os
import json
from dotenv import load_dotenv

#path = 'databases'

class DBCredentials:
    def __init__(self, database, user, password, host, port, schema):
        self.database = database
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.schema = schema
        
    def to_dict(self):
        return {
            'database': self.database,
            'user': self.user,
            'password': self.password,
            'host': self.host,
            'port': self.port,
            'schema': self.schema
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            database=data['database'],
            user=data['user'],
            password=data['password'],
            host=data['host'],
            port=data['port'],
            schema=data['schema']
        )

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


def mysql_credentials():
    load_dotenv() #dotenv_path=path
    return DBCredentials(
        database=os.environ.get("MYSQL_DATABASE"),
        user=os.environ.get("MYSQL_USER"),
        password=os.environ.get("MYSQL_PASSWORD"),
        host=os.environ.get("MYSQL_HOST"),
        port=os.environ.get("MYSQL_PORT"),
        schema=None
    )

def postgres_credentials():
    load_dotenv() #dotenv_path=path
    return DBCredentials(
        database=os.environ.get("POSTGRES_DBNAME"),
        user=os.environ.get("POSTGRES_USER"),
        password=os.environ.get("POSTGRES_PASSWORD"),
        host=os.environ.get("POSTGRES_HOST"),
        port=os.environ.get("POSTGRES_PORT"),
        schema = 'test'
    )

   

