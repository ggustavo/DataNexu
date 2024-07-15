from data_nexus.log_handle.log import *
from data_nexus.database_connections.postgresql_connection import PostgreSQLConnection
from data_nexus.data_access.metadata_models import Table, Column, Constraint, Index

def postgres_fetch_tables(postgres: PostgreSQLConnection, excluded_tables=[]):
    table_data = []
    for table in postgres_database_info(postgres):
        if table not in excluded_tables:
            table_data.append(postgres_metadata_table(postgres, table))
    return table_data

def postgres_database_info(postgres: PostgreSQLConnection):
    try:
        with postgres.connection.cursor() as cursor:
            sql = f"SELECT table_name FROM information_schema.tables WHERE table_schema = '{postgres.schema}' AND table_catalog = '{postgres.database}'"
            log_debug(f"Query: {sql}")

            cursor.execute(sql)

            return [table[0] for table in cursor.fetchall()]

    except Exception as e:
        log_error(f"Error searching metadata for schema {postgres.schema}: {e}")
        raise e

def postgres_metadata_table(postgres: PostgreSQLConnection, table_name):
    try:
        table = fetch_table_info(postgres, table_name)
        if table is None:
            return None
        columns = fetch_columns_info(postgres, table_name)
        if columns is None:
            return None
        constraints = fetch_constraints_info(postgres, table_name)
        if constraints is None:
            return None
        indexes = fetch_indexes_info(postgres, table_name)
        if indexes is None:
            return None
        table.columns = columns
        table.constraints = constraints
        table.indexes = indexes
        return table
    except Exception as e:
        log_error(f"Error searching metadata for table {postgres.schema}.{table_name}: {e}")
        raise e

def fetch_table_info(postgres: PostgreSQLConnection, table_name):
    try:
        with postgres.connection.cursor() as cursor:
            sql = f"SELECT COUNT(*) as num_tuples FROM {postgres.schema}.{table_name};"
            log_debug(f"Query: {sql}")
            cursor.execute(sql)
            result = cursor.fetchone()
            num_tuples = result[0]
            table = Table(name=table_name, num_tuples=num_tuples)
            return table
    except Exception as e:
        log_error(f"Error searching metadata for table {postgres.schema}.{table_name}: {e}")
        raise e

def fetch_columns_info(postgres: PostgreSQLConnection, table_name):
    try:
        sql = f"""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = '{postgres.schema}' and table_name = '{table_name}';
        """
        log_debug(f"Query: {sql}")

        with postgres.connection.cursor() as cursor:
            cursor.execute(sql)
            columns = []
            for row in cursor.fetchall():
                column_name, data_type, is_nullable, column_default = row
                nullable = is_nullable == 'YES'
                column = Column(name=column_name, data_type=data_type, nullable=nullable, default=column_default)
                columns.append(column)
            return columns
    except Exception as e:
        log_error(f"Error fetching columns info for table {postgres.schema}.{table_name}: {e}")
        raise e

def fetch_constraints_info(postgres: PostgreSQLConnection, table_name):
    try:
        sql = f"""    
         SELECT
            tc.constraint_name,
            kcu.column_name,
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM
            information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE
            tc.table_name = '{table_name}'
            AND tc.table_schema = '{postgres.schema}';
        """
        log_debug(f"Query: {sql}")

        with postgres.connection.cursor() as cursor:
            cursor.execute(sql)
            constraints = []
            for row in cursor.fetchall():
                constraint_name, column_name, referenced_table_schema, referenced_table_name, referenced_column_name = row
                constraint = Constraint(name=constraint_name, column_name=column_name,
                                        referenced_table_schema=referenced_table_schema,
                                        referenced_table_name=referenced_table_name,
                                        referenced_column_name=referenced_column_name)
                constraints.append(constraint)
            return constraints
    except Exception as e:
        log_error(f"Error fetching constraints info for table {postgres.schema}.{table_name}: {e}")
        raise e


def fetch_indexes_info(postgres: PostgreSQLConnection, table_name):
    try:
        sql = f"""
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = '{table_name}' and schemaname = '{postgres.schema}';
        """
        log_debug(f"Query: {sql}")

        with postgres.connection.cursor() as cursor:
            cursor.execute(sql)
            indexes = []
            for row in cursor.fetchall():
                index_name, indexdef = row
                index_type = extract_index_type(indexdef)
                column_names = extract_index_columns(indexdef)
                non_unique = 'UNIQUE' not in indexdef
                nullable = False  # You may need to adjust this based on your knowledge about the index
                column_name = ', '.join(column_names)
                index = Index(name=index_name, column_name=column_name, nullable=nullable,
                                  index_type=index_type, non_unique=non_unique, excluded=False)
                indexes.append(index)
            return indexes
    except Exception as e:
        log_error(f"Error fetching indexes info for table {postgres.schema}.{table_name}: {e}")
        raise e

def extract_index_type(indexdef):
    if 'USING btree' in indexdef:
        return 'btree'
    elif 'USING gist' in indexdef:
        return 'gist'
    elif 'USING gin' in indexdef:
        return 'gin'
    else:
        return 'unknown'

def extract_index_columns(indexdef):
    # Extract columns from index definition
    start = indexdef.find('(') + 1
    end = indexdef.find(')')
    columns = indexdef[start:end].split(',')
    # Remove whitespace and surrounding quotes from column names
    columns = [col.strip().strip('"') for col in columns]
    return columns