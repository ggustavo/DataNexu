import json

class Table:
    def __init__(self, name, num_tuples, excluded=False, columns=None, constraints=None, indexes=None,
                 table_commited=False, primary_key_commited=False, constraints_commited=False,
                 indexes_commited=False, tuples_commited=False):
        self.name = name
        self.num_tuples = num_tuples
        self.columns = columns or []
        self.constraints = constraints or []
        self.indexes = indexes or []

        # Used to track if the table has been commited to the target database or removed from migration
        self.excluded = excluded
        self.table_commited = table_commited
        self.primary_key_commited = primary_key_commited
        self.constraints_commited = constraints_commited
        self.indexes_commited = indexes_commited
        self.tuples_commited = tuples_commited
        
    def to_dict(self):
        return {
            'name': self.name,
            'num_tuples': self.num_tuples,
            'columns': [column.to_dict() for column in self.columns],
            'constraints': [constraint.to_dict() for constraint in self.constraints],
            'indexes': [index.to_dict() for index in self.indexes],
            'excluded': self.excluded,
            'table_commited': self.table_commited,
            'primary_key_commited': self.primary_key_commited,
            'constraints_commited': self.constraints_commited,
            'indexes_commited': self.indexes_commited,
            'tuples_commited': self.tuples_commited
        }
        
    @classmethod
    def from_dict(cls, data):
        columns = [Column.from_dict(col) for col in data.get('columns', [])]
        constraints = [Constraint.from_dict(con) for con in data.get('constraints', [])]
        indexes = [Index.from_dict(idx) for idx in data.get('indexes', [])]
        return cls(
            name=data['name'],
            num_tuples=data['num_tuples'],
            excluded=data.get('excluded', False),
            columns=columns,
            constraints=constraints,
            indexes=indexes,
            table_commited=data.get('table_commited', False),
            primary_key_commited=data.get('primary_key_commited', False),
            constraints_commited=data.get('constraints_commited', False),
            indexes_commited=data.get('indexes_commited', False),
            tuples_commited=data.get('tuples_commited', False)
        )


    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class Column:
    def __init__(self, name, data_type, nullable, default):
        self.name = name
        self.data_type = data_type
        self.nullable = nullable
        self.default = default
        
    def to_dict(self):
        return {
            'name': self.name,
            'data_type': self.data_type,
            'nullable': self.nullable,
            'default': self.default
        }
    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data['name'],
            data_type=data['data_type'],
            nullable=data['nullable'],
            default=data['default']
        )

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class Constraint:
    def __init__(self, name, column_name, referenced_table_schema, referenced_table_name, referenced_column_name):
        self.name = name
        self.column_name = column_name
        self.referenced_table_schema = referenced_table_schema
        self.referenced_table_name = referenced_table_name
        self.referenced_column_name = referenced_column_name
    
    def to_dict(self):
        return {
            'name': self.name,
            'column_name': self.column_name,
            'referenced_table_schema': self.referenced_table_schema,
            'referenced_table_name': self.referenced_table_name,
            'referenced_column_name': self.referenced_column_name
        }
        
    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data['name'],
            column_name=data['column_name'],
            referenced_table_schema=data['referenced_table_schema'],
            referenced_table_name=data['referenced_table_name'],
            referenced_column_name=data['referenced_column_name']
        )


    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)


class Index:
    def __init__(self, name, column_name, nullable, index_type, non_unique, excluded):
        self.name = name
        self.column_name = column_name
        self.nullable = nullable
        self.index_type = index_type
        self.non_unique = non_unique
        self.excluded: bool = excluded
        
    def to_dict(self):
        return {
            'name': self.name,
            'column_name': self.column_name,
            'nullable': self.nullable,
            'index_type': self.index_type,
            'non_unique': self.non_unique,
            'excluded': self.excluded
        }
        
    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data['name'],
            column_name=data['column_name'],
            nullable=data['nullable'],
            index_type=data['index_type'],
            non_unique=data['non_unique'],
            excluded=data['excluded']
        )

    def __str__(self):
        return json.dumps(self.to_dict(), indent=4)

