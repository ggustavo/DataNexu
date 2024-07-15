let current_connection = null;
function changeDBMS() {
    let dbms = document.getElementById("dbms").value;
    let logo = document.getElementById("database_logo");
    
    let postgresContent = document.getElementById("modal_content_postgres");
    let mysqlContent = document.getElementById("modal_content_mysql");
    let sqlserverContent = document.getElementById("modal_content_sqlserver");

    let postgresContent_dp = document.getElementById("modal_content_postgres_host_port");
    let mysqlContent_dp = document.getElementById("modal_content_mysql_host_port");
    let sqlserverContent_dp = document.getElementById("modal_content_sqlserver_host_port");

    postgresContent.style.display = "none";
    mysqlContent.style.display = "none";
    sqlserverContent.style.display = "none";

    postgresContent_dp.style.display = "none";
    mysqlContent_dp.style.display = "none";
    sqlserverContent_dp.style.display = "none";

    if (dbms === "postgresql") {
        logo.src = "/static/icons/postgresql_logo.png";
        postgresContent.style.display = "block";
        postgresContent_dp.style.display = "block";
    } else if (dbms === "mysql") {
        logo.src = "/static/icons/mysql_logo.png";
        mysqlContent.style.display = "block";
        mysqlContent_dp.style.display = "block";
    } else if (dbms === "sqlserver") {
        logo.src = "/static/icons/sqlserver_logo.png";
        sqlserverContent.style.display = "block";
        sqlserverContent_dp.style.display = "block";
    }
}


function new_graph(connection, name, id, type, visualization, centrality_type) {

    request_graph_data(connection, type, centrality_type, function(graph) {
        if (graph == null) {
            console.log("Error: graph is null");
            return;
        }
    
        const containerId = `ct-${id}`;
    
        const tabsContainer = document.getElementById('tabs');
        const backgroundContainer = document.querySelector('.background');
        
        const newTab = document.createElement('div');
        newTab.classList.add('tab');
        newTab.setAttribute('data-tab', containerId);
    
        
        const newTabLabel = document.createElement('span');
        newTabLabel.textContent = name;
        
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-tab');
        closeButton.textContent = 'x';
    
        newTab.appendChild(newTabLabel);
        newTab.appendChild(closeButton);
        tabsContainer.appendChild(newTab);
        
        const newTabContent = document.createElement('div');
        newTabContent.classList.add('tab-content');
        newTabContent.setAttribute('id', containerId);
        //newTabContent.textContent = `Conteúdo da Tab ${name}`;
    
        backgroundContainer.appendChild(newTabContent);
    
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation();
    
            tabsContainer.removeChild(newTab);
            backgroundContainer.removeChild(newTabContent);
    
            if (newTab.classList.contains('active')) {
                if (tabsContainer.children.length > 0) {
                    const firstTab = tabsContainer.children[0];
                    firstTab.classList.add('active');
                    document.getElementById(firstTab.getAttribute('data-tab')).classList.add('active');
                } 
            }
        });
    
        newTab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            newTab.classList.add('active');
            newTabContent.classList.add('active');
        });
    
        // Simula um clique na nova aba para ativá-la
        newTab.click();
        graph.connection = connection;
        render_graph(graph, "#"+containerId, type, visualization); // HERE !!
    });

    
}


function start(){

    document.getElementById('menu_button').addEventListener('click', function() {
        const menu = document.getElementById('menu');
        const menu_button = document.getElementById('menu_button');
       // const search = document.getElementById('search-container');
        const tabs = document.getElementById('tabs');

        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
            menu_button.classList.remove('open');
            tabs.classList.remove('open');
        //  search.classList.remove('open');
        } else {
            menu.classList.add('open');
            menu_button.classList.add('open');
            tabs.classList.add('open');
        //    search.classList.add('open');
        }
    });

    // Função para fechar o modal
    document.getElementById('close_modal_button').addEventListener('click', function() {
        document.getElementById('modal_overlay_connection').style.display = 'none';
    });

    // Fecha o modal se o usuário clicar fora dele
    document.getElementById('modal_overlay_connection').addEventListener('click', function(event) {
        if (event.target === this) {
            this.style.display = 'none';
        }
    });

    document.getElementById('new_connection_button').addEventListener('click', function() {
        // Abre o modal
        document.getElementById('modal_overlay_connection').style.display = 'flex';
    });

    const callback_conn = function(connection) {
        let item = null;
        
        if (connection != null){
            item = create_list_item_connection(connection);
        }
        if(item != null ){

            connection.item = item;

            item.addEventListener('click', function() {
                console.log(connection);

                if (current_connection != null){
                    current_connection.item.classList.remove("active");
                }
                current_connection = connection;
                current_connection.item.classList.add("active");
                
            });
        }
        document.getElementById('modal_overlay_connection').style.display = 'none';
    };

    document.getElementById('start_database_connection').addEventListener('click', function() {
        
        const dbms =  document.getElementById("dbms").value

        if (dbms == "postgresql"){
            validate_connection_postgres(callback_conn);
        }

        if (dbms == "mysql"){
            validate_connection_mysql(callback_conn);
        }

        if (dbms == "sqlserver"){
            validate_connection_sqlserver(callback_conn);
        }
    });

  
    let tabCount = 0;
    let select_size_type = null;
    let select_size_title = null;
    let select_graph_visualization = null;
    let select_centrality_type = null;


    // graph_both graph_prestige graph_influence

    document.getElementById('graph_both').addEventListener('click', function() {
        select_centrality_type = "graph_both";
        document.getElementById('graph_both').querySelector('.grid_icon').classList.add('active');
        document.getElementById('graph_prestige').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_influence').querySelector('.grid_icon').classList.remove('active');
    });

    document.getElementById('graph_prestige').addEventListener('click', function() {
        select_centrality_type = "graph_prestige";
        document.getElementById('graph_both').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_prestige').querySelector('.grid_icon').classList.add('active');
        document.getElementById('graph_influence').querySelector('.grid_icon').classList.remove('active');
    });

    document.getElementById('graph_influence').addEventListener('click', function() {
        select_centrality_type = "graph_influence";
        document.getElementById('graph_both').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_prestige').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_influence').querySelector('.grid_icon').classList.add('active');
    });

   
    document.getElementById('graph_tuples').addEventListener('click', function() {
        select_size_title = "Tuples";
        select_size_type = "graph_tuples";

        //document.getElementById('graph_tuples').querySelector('.grid_icon').src = "/static/icons/g_tuples_active.png";
        //document.getElementById('graph_indexes').querySelector('.grid_icon').src = "/static/icons/g_indexes.png";
        //document.getElementById('graph_relationships').querySelector('.grid_icon').src = "/static/icons/g_relationships.png";

        document.getElementById('graph_tuples').querySelector('.grid_icon').classList.add('active');
        document.getElementById('graph_indexes').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_relationships').querySelector('.grid_icon').classList.remove('active');
        fade_out_label();

    });

    document.getElementById('graph_indexes').addEventListener('click', function() {
        select_size_title = "Indexes";
        select_size_type = "graph_indexes";

       // document.getElementById('graph_tuples').querySelector('.grid_icon').src = "/static/icons/g_tuples.png";
       // document.getElementById('graph_indexes').querySelector('.grid_icon').src = "/static/icons/g_indexes_active.png";
        //document.getElementById('graph_relationships').querySelector('.grid_icon').src = "/static/icons/g_relationships.png";
        
        document.getElementById('graph_tuples').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_indexes').querySelector('.grid_icon').classList.add('active');
        document.getElementById('graph_relationships').querySelector('.grid_icon').classList.remove('active');
        fade_out_label();
    });

    document.getElementById('graph_relationships').addEventListener('click', function() {
        select_size_title = "Relationships";
        select_size_type = "graph_relationships";

       // document.getElementById('graph_tuples').querySelector('.grid_icon').src = "/static/icons/g_tuples.png";
       // document.getElementById('graph_indexes').querySelector('.grid_icon').src = "/static/icons/g_indexes.png";
       // document.getElementById('graph_relationships').querySelector('.grid_icon').src = "/static/icons/g_relationships_active.png";

        document.getElementById('graph_tuples').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_indexes').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_relationships').querySelector('.grid_icon').classList.add('active')
        fade_in_label();
    });


    function fade_out_label() {
        var label = document.getElementById('label_type_relat');
        var div = document.getElementById('div_type_relat');

        label.classList.remove('fade-in');
        div.classList.remove('fade-in');

        label.classList.add('fade-out');
        div.classList.add('fade-out');

        setTimeout(function() {
            label.style.display = 'none';
            div.style.display = 'none';
        }, 500); 
    }

    function fade_in_label() {
        var label = document.getElementById('label_type_relat');
        var div = document.getElementById('div_type_relat');

        label.style.display = 'flex';
        div.style.display = 'flex';

        setTimeout(function() {
            label.classList.remove('fade-out');
            div.classList.remove('fade-out');

            label.classList.add('fade-in');
            div.classList.add('fade-in');
        }, 10); 
    }

    
    //graph_grouped
    document.getElementById('graph_grouped').addEventListener('click', function() {
        select_graph_visualization = "graph_grouped";
        //document.getElementById('graph_grouped').querySelector('.grid_icon').src = "/static/icons/g_grouped_active.png";
        //document.getElementById('graph_free').querySelector('.grid_icon').src = "/static/icons/g_free.png";
        document.getElementById('graph_grouped').querySelector('.grid_icon').classList.add('active');
        document.getElementById('graph_free').querySelector('.grid_icon').classList.remove('active');
        
    });

    document.getElementById('graph_free').addEventListener('click', function() {
        select_graph_visualization = "graph_free";
        //document.getElementById('graph_grouped').querySelector('.grid_icon').src = "/static/icons/g_grouped.png";
        //document.getElementById('graph_free').querySelector('.grid_icon').src = "/static/icons/g_free_active.png";
        document.getElementById('graph_grouped').querySelector('.grid_icon').classList.remove('active');
        document.getElementById('graph_free').querySelector('.grid_icon').classList.add('active');

    });

    document.getElementById('analyze_database').addEventListener('click', function() {
       build_graph(select_graph_visualization, select_size_type, select_size_title, select_centrality_type);
    });

    function build_graph(visualization, type, title, select_centrality_type){
        
        if (current_connection == null){
            showErrorModal("No connection selected");
            return;
        }
        tabCount++;
        const name = `${current_connection.database} - ${title} #${tabCount}`
        console.log("new tab for " + name);
        new_graph(current_connection, name, tabCount, type, visualization, select_centrality_type);
    }
    
    document.getElementById('graph_relationships').click();
    document.getElementById('graph_grouped').click();   
    document.getElementById('graph_both').click();
    request_connections(function(connections) {
        for (let i = 0; i < connections.length; i++) {
            let connection = connections[i];
            callback_conn(connection)
        }
     });


     const prop_button = document.getElementById('prop_menu_open_button');
     const prop_menu = document.getElementById('prop_menu_body');
     const prop_icon = prop_button.querySelector(".prop_menu_open_icon");

     prop_button.addEventListener('click', () => {

        if (prop_menu.classList.contains('open')) {
            prop_menu.classList.remove('open');
        } else {
            prop_menu.classList.add('open');
        }
        
        prop_icon.classList.toggle('rotated');
            
     });

    
}

function showErrorModal(errorMsg) {
    // Create modal elements
    var modal = document.createElement("div");
    modal.className = "modal-error";

    var messageParagraph = document.createElement("p");
    messageParagraph.textContent = errorMsg;

    var closeButton = document.createElement("span");
    closeButton.className = "modal-error-close";
    closeButton.innerHTML = "&times;";

    // Append elements
    modal.appendChild(messageParagraph);
    modal.appendChild(closeButton);
    document.getElementById("errorQueue").appendChild(modal);

    // Add close event
    closeButton.onclick = function() {
        modal.style.display = "none";
        document.getElementById("errorQueue").removeChild(modal);
    };

    // Automatically remove the modal after a delay (e.g., 5 seconds)
    setTimeout(function() {
        if (modal.parentNode) {
            modal.style.display = "none";
            document.getElementById("errorQueue").removeChild(modal);
        }
    }, 5000);
}


window.addEventListener('load', (event) => {
    start();
});



let last_table_name = null;

function updateTableInfo(json) {
    last_table_name = json.name;
    // Table Information
    document.getElementById('table-name').textContent = json.name;
    document.getElementById('num-tuples').textContent = json.num_tuples;

    // Columns Information
    const columnsTableBody = document.getElementById('columns-table').querySelector('tbody');
    columnsTableBody.innerHTML = '';
    json.columns.forEach(column => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="prop_menu_td">${column.name}</td>
            <td class="prop_menu_td">${column.data_type}</td>
            <td class="prop_menu_td">${column.nullable}</td>
            <td class="prop_menu_td">${column.default}</td>
        `;
        columnsTableBody.appendChild(row);
    });

    // Constraints Information
    const constraintsTableBody = document.getElementById('constraints-table').querySelector('tbody');
    constraintsTableBody.innerHTML = '';
    json.constraints.forEach(constraint => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="prop_menu_td">${constraint.name}</td>
            <td class="prop_menu_td">${constraint.column_name}</td>
            <td class="prop_menu_td">${constraint.referenced_table_schema}</td>
            <td class="prop_menu_td">${constraint.referenced_table_name}</td>
            <td class="prop_menu_td">${constraint.referenced_column_name}</td>
        `;
        constraintsTableBody.appendChild(row);
    });

    // Indexes Information
    const indexesTableBody = document.getElementById('indexes-table').querySelector('tbody');
    indexesTableBody.innerHTML = '';
    json.indexes.forEach(index => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="prop_menu_td">${index.name}</td>
            <td class="prop_menu_td">${index.column_name}</td>
            <td class="prop_menu_td">${index.nullable}</td>
            <td class="prop_menu_td">${index.index_type}</td>
            <td class="prop_menu_td">${index.non_unique}</td>
        `;
        indexesTableBody.appendChild(row);
    });
}
