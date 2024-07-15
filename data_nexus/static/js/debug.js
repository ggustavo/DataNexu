
function debug_request_graph_data(connection, type, call) {

    let graph = {
        nodes: [
            { id: "node0" },
            { id: "node1" },
            { id: "node2" },
            { id: "node3" },
            { id: "node4" },
            { id: "node5" },
            { id: "node6" },
            { id: "node7" },
            { id: "node8" },
            { id: "node9" },
            { id: "node10" },
            { id: "node11" },
            { id: "node12" }
        ],
        links: [
            { source: "node0", target: "node1" },
            { source: "node1", target: "node2" },
            { source: "node2", target: "node0" },
            { source: "node1", target: "node3" },
            { source: "node3", target: "node2" },
            { source: "node3", target: "node4" },
            { source: "node4", target: "node5" },
            { source: "node5", target: "node6" },
            { source: "node5", target: "node7" },
            { source: "node6", target: "node7" },
            { source: "node6", target: "node8" },
            { source: "node7", target: "node8" },
            { source: "node9", target: "node4" },
            { source: "node9", target: "node11" },
            { source: "node9", target: "node10" },
            { source: "node10", target: "node11" },
            { source: "node11", target: "node12" },
            { source: "node12", target: "node10" }
        ]
    };

   // console.log(graph);
    call(graph);
}


let count_connections = 0;

function debug_request_connection(connection, call){
    connection.id = connection.dbms + count_connections++;
    call(connection);
    return connection;
}

function debug_request_connections(call) {
    
}