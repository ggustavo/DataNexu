const width = 1200;
const height = Math.min(500, width * 0.6);


function render_graph(graph, container_id, type, visualization) {

    if (graph === undefined) {
        return null;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    console.log(graph);
    console.log("nodes: ",graph.nodes.length, "links: ", graph.links.length);

    if (visualization === "graph_grouped") {
        render_graph_community(graph, container_id, width, height);
    } else if (visualization === "graph_free") {
        render_graph_free(graph, container_id, width, height);
    } 

}