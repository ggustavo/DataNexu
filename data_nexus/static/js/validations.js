function database_icon(dbms){
    if (dbms == "postgresql"){ return "/static/icons/postgresql_logo.png"; }
    if (dbms == "mysql"){ return "/static/icons/mysql_logo.png"; }
    if (dbms == "sqlserver"){ return "/static/icons/sqlserver_logo.png"; }
    return "/static/icons/database_logo.png";
}

function string_abrev(text, size){
    if(text != null){
        return text;
    }
    return "null";
}

function validate_connection_postgres(callback) {
    const host = document.getElementById("postgresql_host").value.trim();
    const port = document.getElementById("postgresql_port").value.trim();
    const database = document.getElementById("postgresql_database").value.trim();
    const schema = document.getElementById("postgresql_schema").value.trim();
    const user = document.getElementById("postgresql_user").value.trim();
    const password = document.getElementById("postgresql_password").value;

    if (!host || !port || !database || !schema || !user) {
        showErrorModal("Please fill all credentials");
        return null;
    }

    let connection = create_connection("postgresql", host, port, database, schema, user, password);
    request_connection(connection, callback);
}

function validate_connection_mysql(callback) {
    const host = document.getElementById("mysql_host").value.trim();;
    const port = document.getElementById("mysql_port").value.trim();;
    const database = document.getElementById("mysql_database").value.trim();;
    const user = document.getElementById("mysql_user").value.trim();;
    const password = document.getElementById("mysql_password").value;

    if (!host || !port || !database || !user) {
        showErrorModal("Please fill all credentials");
        return null;
    }

    let connection = create_connection("mysql", host, port, database, null, user, password);
    request_connection(connection, callback);
}

function validate_connection_sqlserver(callback) {
    const host = document.getElementById("sqlserver_host").value.trim();;
    const port = document.getElementById("sqlserver_port").value.trim();;
    const database = document.getElementById("sqlserver_database").value.trim();;
    const user = document.getElementById("sqlserver_user").value.trim();;
    const password = document.getElementById("sqlserver_password").value;

    if (!host || !port || !database || !user) {
        showErrorModal("Please fill all credentials");
        return null;
    }

    let connection = create_connection("sqlserver", host, port, database, null, user, password);
    request_connection(connection, callback);
}