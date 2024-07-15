import json
from data_nexus.log_handle.log import *
from data_nexus.data_access.metadata_models import Table
from data_nexus.configuration_management.db_credentials import DBCredentials
from data_nexus.database_connections.mysql_connection import MySQLConnection
from data_nexus.database_connections.postgresql_connection import PostgreSQLConnection

def save_database_json_file(tables, file_name):
    try:
        log_error(f"Saving JSON file: {file_name}")
        data = [table.to_dict() for table in tables]
        with open(file_name, "w+") as outfile:
            json.dump(data, outfile, indent=4)
    except Exception as e:
        log_error(f"Error occurred while saving JSON file: {e}")
        

def load_database_json_file(file_name):
    try:
        with open(file_name, "r") as f:
            log_info(f"Loading JSON file: {file_name}")
            data = json.load(f)
            tables = dict_list_to_table_list(data)
            return tables
    except FileNotFoundError:
        log_error(f"File '{file_name}' not found.")
        return None
    except Exception as e:
        log_error(f"Error occurred while loading JSON file: {e}")
        return None


def dict_list_to_table_list(data):
    tables = []
    for table in data:
        tables.append(Table.from_dict(table))
    return tables



def save_connections_json_file(connections, file_name):
    try:
        log_error(f"Saving JSON file: {file_name}")
        data = []
        for id, connection in connections.items():
            record = {
                'id': id,
                'type': connection.__class__.__name__,
                'credentials': connection.db_credentials.to_dict()
            }
            data.append(record)
        with open(file_name, "w+") as outfile:
            json.dump(data, outfile, indent=4)
    except Exception as e:
        log_error(f"Error occurred while saving JSON file: {e}")
        
        
def load_connections_json_file(file_name):
    try:
        with open(file_name, "r") as f:
            log_info(f"Loading JSON file: {file_name}")
            data = json.load(f)
            connections = dict_list_to_connection_list(data)
            
            return connections
    except FileNotFoundError:
        log_error(f"File '{file_name}' not found.")
        return None
    except Exception as e:
        log_error(f"Error occurred while loading JSON file: {e}")
        return None
    
def dict_list_to_connection_list(data):
    connections = {}
    for record in data:
        connection = None
        if record['type'] == 'MySQLConnection':
            credentials = DBCredentials.from_dict(record['credentials'])
            connection = MySQLConnection(credentials)
        if record['type'] == 'PostgreSQLConnection':
            credentials = DBCredentials.from_dict(record['credentials'])
            connection = PostgreSQLConnection(credentials)
        connections.update({record['id'] : connection})
    return connections