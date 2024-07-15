import unittest

from data_nexus.configuration_management.db_credentials import  mysql_credentials, postgres_credentials
from data_nexus.database_connections.mysql_connection import MySQLConnection
from data_nexus.database_connections.postgresql_connection import PostgreSQLConnection
from data_nexus.data_access.metadata_models import Table, Column, Constraint, Index
from data_nexus.data_access.postgresql_metadata_reader import *

class TestConnections(unittest.TestCase):

    #def test_mysql_connection(self):
    #    mysql_conn = MySQLConnection(mysql_credentials())
    #    mysql_conn.create()
    #    self.assertIsNotNone(mysql_conn.connection, 'The MySQL connection is None.')
    #    mysql_conn.close()

    def test_postgresql_connection(self):
        postgres_conn = PostgreSQLConnection(postgres_credentials())
        postgres_conn.create()
        self.assertIsNotNone(postgres_conn.connection, 'The PostgreSQL connection is None.')
        
        # Test postgres_fetch_tables
        #table_name = postgres_database_info(postgres_conn)[1]
        #print(table_name)
        
        #table = fetch_table_info(postgres_conn, table_name)
        #columns = fetch_columns_info(postgres_conn, table_name)
        #table.columns = columns
        
        #constraints = fetch_constraints_info(postgres_conn, table_name)
        #table.constraints = constraints
        #postgres_conn.schema = "pg_catalog"
        #indexes = fetch_indexes_info(postgres_conn, "pg_proc")
        #table.indexes = indexes
        #print(table)

        postgres_conn.close()

if __name__ == '__main__':
    unittest.main()
    
    
    
    
    
    
    
    
    
    
    