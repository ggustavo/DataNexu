function create_connection(dbms, host, port, database, schema, user, password){
    return {
        "dbms":dbms,
        "host":host,
        "port":port, 
        "database":database,
        "schema":schema, 
        "user":user, 
        "password":password,

        "id":null,
        "item":null
    }
}

function create_list_item_connection(connection){
    const new_item = document.createElement('div');
    new_item.className = 'connection_item';
    new_item.id = connection.id;
    connection.item = new_item;

    const icon = document.createElement('img');
    icon.className = 'connection_icon';
    icon.src = database_icon(connection.dbms)

    const textContainer = document.createElement('div');
    textContainer.className = 'connection_text';

    const host_n_port = document.createElement('span');
    host_n_port.textContent = string_abrev(connection.host) + ":" + connection.port;

    const database_n_schema = document.createElement('span');
    database_n_schema.textContent = string_abrev(connection.database) + "" 
                + (connection.schema != null  ? "."+string_abrev(connection.schema): "");


    const editIcon = document.createElement('img');
    editIcon.className = 'edit_icon';
    editIcon.src = '/static/icons/edit.png'; 

    textContainer.appendChild(host_n_port);
    textContainer.appendChild(database_n_schema);

    new_item.appendChild(icon);
    new_item.appendChild(textContainer);
    new_item.appendChild(editIcon);

    document.getElementById('connections_container').appendChild(new_item);
    return new_item;
}