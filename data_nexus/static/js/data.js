const debug = false;

const SERVER_HOST = "localhost"
const SERVER_PORT = 5000;
const URL = 'http://' + SERVER_HOST + ':' + SERVER_PORT;

let headers = new Headers();
headers.append("Content-Type", "application/json");

function requestOptions(){ 
    return {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
    };
}

function request_connection(connection, call) {
    if (debug) return debug_request_connection(connection, call);

    let ro = requestOptions();
    ro.body = JSON.stringify(connection);

    fetch(URL + "/validate_connection", ro)
    .then(response => {
        //console.log('Response status:', response.status);
        return response.text();
    })
    .then(result => {
        // console.log('Result:', result);
        if (result != null) {
            result = JSON.parse(result);
            
            if (result.error) {
                showErrorModal(result.error);
            } else {
                connection.id = result.id;
                call(connection);
            }
        }
    }) 
    .catch(error => {
        console.log('Error:', error);
        showErrorModal(error);
    });
}


function request_connections(call) {
    if (debug) return debug_request_connections(call);
    let ro = requestOptions();
    ro.method = 'POST';

    fetch(URL + "/connections", ro)
    .then(response => {
        //console.log('Response status:', response.status);
        return response.text();
    })
    .then(result => {
        //console.log('Result:', result);
        if (result != null) {
            result = JSON.parse(result);
            
            if (result.error) {
                showErrorModal(result.error);
            } else {
                call(result);
            }
        }
    }) 
    .catch(error => {
        console.log('Error:', error);
        showErrorModal(error);
    });

}

function request_graph_data(connection, type, centrality_type, call) {
    if (debug) return debug_request_graph_data(connection, type, call);

    let ro = requestOptions();
    ro.body = JSON.stringify({
        "id":connection.id,
        "type":type,
        "centrality_type": centrality_type
    });

    fetch(URL + "/graph", ro)
    .then(response => {
        //console.log('Response status:', response.status);
        return response.text();
    })
    .then(result => {
        // console.log('Result:', result);
        if (result != null) {
            result = JSON.parse(result);
            
            if (result.error) {
                showErrorModal(result.error);
            } else {
                //console.log(result);
                call(result);
            }
        }
    }) 
    .catch(error => {
        console.log('Error:', error);
        showErrorModal(error);
    });
    
}



function request_table_metadata(connection, name, call) {
    

    let ro = requestOptions();
    ro.body = JSON.stringify({
        "id":connection.id,
        "name":name
    });

    fetch(URL + "/metadadata", ro)
    .then(response => {
        //console.log('Response status:', response.status);
        return response.text();
    })
    .then(result => {
        // console.log('Result:', result);
        if (result != null) {
            result = JSON.parse(result);
            
            if (result.error) {
                showErrorModal(result.error);
            } else {
                //console.log(result);
                call(result);
            }
        }
    }) 
    .catch(error => {
        console.log('Error:', error);
        showErrorModal(error);
    });
    
}