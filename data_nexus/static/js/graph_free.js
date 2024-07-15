function render_graph_free(graph, container_id, width, height) {
    width = width * 3
    height = height * 3
    const sizeScale = d3.scaleLog()
    .domain([1, d3.max(graph.nodes, d => d.size)]) // Começando de 1 em vez de 0
    .range([5, 50]); // Define o intervalo para o tamanho dos nós

    const svg = d3.select(container_id)
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content-responsive", true);

        const arrow_id = "arrow_"+container_id;

        svg.append("defs").append("marker")
            .attr("id", arrow_id)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 9)  // Ajuste conforme necessário para posicionar corretamente a seta
            .attr("refY", 0)
            .attr("markerWidth", 6)  // Ajuste conforme necessário
            .attr("markerHeight", 6)  // Ajuste conforme necessário
            .attr("orient", "auto")
        .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "grey");  // Cor da seta

    const g = svg.append("g");

    const outline = g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "grey") // Cor da borda
        .attr("stroke-opacity", 0.1) // Opacidade da borda
        .attr("fill", "none"); // Sem preenchimento

    let link = g
        .selectAll(".link")
        .data(graph.links)
        .join("line")
        .classed("link", true)
        .attr("marker-end", "url(#"+arrow_id+")")  // Adicione esta linha
        .on("click", function(event, d) {
            console.log("Link clicado:", d);
        });

    let node = g
        .selectAll(".node")
        .data(graph.nodes)
        .join("g")
        .classed("node", true)
        .classed("fixed", d => d.fx !== undefined);

    node.append("circle")
        .attr("r", function(d) {
            if (d.size !== undefined) {
                return Math.max(5, sizeScale(Math.max(1, d.size)))
            } else {
                return 5;
            }
        })
        .attr("fill", function(d) {
            if (d.color !== undefined) {
                return d.color;
            } else {
                return "black";
            }
        });

    node.append("text")
        .attr("dy", "0.35em") // Ajuste fino para centralizar o texto verticalmente
        .attr("text-anchor", "middle") // Ancoragem central do texto
        .attr("fill", "black") // Cor do texto
        .attr("font-size", "12px") // Tamanho da fonte do texto
        .attr("stroke-width", "0px") // Cor do contorno do texto
        .text(d => d.id); // Exibe o id do nó como texto

        node.each(function(d) {
            const circle = d3.select(this).select("circle");
            const text = d3.select(this).select("text");
        
            const radius = +circle.attr("r");
            const textLength = d.id.length * 7; // Ajuste fino para estimar o comprimento do texto em pixels
            const padding = 2; // Espaçamento entre o círculo e o texto
        
            // Verifica se o texto cabe dentro do círculo
            if (textLength <= 2 * radius - padding) {
                text.attr("dy", "0.35em") // Ajuste fino para centralizar o texto verticalmente
                    .attr("text-anchor", "middle") // Ancoragem central do texto
                    .attr("x", 0) // Centraliza horizontalmente o texto
                    .attr("y", 0) // Alinha o texto ao centro do círculo
                    .attr("fill", "black") // Cor do texto
                    .attr("font-size", "12px") // Tamanho da fonte do texto
                    .attr("stroke-width", "0px") // Cor do contorno do texto
                    .text(d => d.id); // Exibe o id do nó como texto
            } else {
                // Posiciona o texto abaixo do círculo
                text.attr("dy", "1em") // Distância do texto abaixo do círculo
                    .attr("text-anchor", "middle") // Ancoragem central do texto
                    .attr("x", 0) // Centraliza horizontalmente o texto
                    .attr("y", radius + padding) // Coloca o texto abaixo do círculo
                    .attr("fill", "black") // Cor do texto
                    .attr("font-size", "12px") // Tamanho da fonte do texto
                    .attr("stroke-width", "0px") // Cor do contorno do texto
                    .text(d => d.id); // Exibe o id do nó como texto
            }
        });

    svg.node();


        /*
    const nodeById = new Map(graph.nodes.map(n => [n.id, n]));
    console.log(nodeById);

    link.each(function(d) {
        const sourceNode = nodeById.get(d.source+""); // Obtém o nó de origem pelo ID
        const targetNode = nodeById.get(d.target+""); // Obtém o nó de destino pelo ID

        if (sourceNode && targetNode) {
            sourceNode.degree = (sourceNode.degree || 0) + 1;
            targetNode.degree = (targetNode.degree || 0) + 1;
           // console.log(d)
        }
    });
        
    const minLinkDistance = 100;
    const maxLinkDistance = 700;

    const minNodeDegreeInLink = d3.min(graph.links, d => Math.min(nodeById.get(d.source+"").degree, nodeById.get(d.target+"").degree));
    const maxNodeDegreeInLink = d3.max(graph.links, d => Math.max(nodeById.get(d.source+"").degree, nodeById.get(d.target+"").degree));

    console.log("Mínimo grau dos nós:", minNodeDegreeInLink);
    console.log("Máximo grau dos nós:", maxNodeDegreeInLink);

    const linkDistanceScale = d3.scaleLinear()
        .domain([minNodeDegreeInLink, maxNodeDegreeInLink])
        .range([minLinkDistance, maxLinkDistance]);

    console.log("Escala de distância dos links:", linkDistanceScale.domain(), linkDistanceScale.range());
    
    console.log(linkDistanceScale(2))
    */
    const simulation = d3
        .forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-200)) // Aumente este valor para mais repulsão
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(graph.links).id(d => d.id).distance(300).strength(0.15))
        /*
        .force("link", d3.forceLink(graph.links).id(d => d.id).distance(function(link) {
            const sourceNode = link.source
            const targetNode = link.target
            const dist = (Math.min(sourceNode.size, targetNode.size));
            return Math.min(Math.max(50, dist), 400);
        })
        .strength(0.15)
        )
        */
     
        /*
        .force("link", d3.forceLink(graph.links).id(d => d.id).distance(function(link) {
            const sourceNode = link.source
            const targetNode = link.target
            const dist = (Math.min(sourceNode.degree, targetNode.degree));
            return linkDistanceScale(dist);
        })
        .strength(0.15)
        )
        */
        .on("tick", tick);

    const drag = d3
        .drag()
        .on("start", dragstart)
        .on("drag", dragged);

    node.call(drag).on("click", click);

    const zoom = d3.zoom()
        .scaleExtent([0.1, 20]) // Define o limite de zoom (mínimo 1x e máximo 10x)
        .on("zoom", (event) => {
            g.attr("transform", event.transform); // Aplica a transformação de zoom ao grupo
            //console.log(event.transform);
        });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity
        .scale(0.5) // Zoom inicial
        .translate(width / 2, height / 4) // Posição inicial
    );

    function clamp(x, lo, hi) {
        return x < lo ? lo : x > hi ? hi : x;
    }

    function tick() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => {
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const normX = dx / dist;
                const normY = dy / dist;
                const targetRadius = Math.max(5, sizeScale(Math.max(1, d.target.size)));
                return d.target.x - normX * targetRadius;
            })
            .attr("y2", d => {
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const normX = dx / dist;
                const normY = dy / dist;
                const targetRadius = Math.max(5, sizeScale(Math.max(1, d.target.size)));
                return d.target.y - normY * targetRadius;
            });
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    }

    function click(event, d) {
        delete d.fx;
        delete d.fy;
        d3.select(this).classed("fixed", false);
        simulation.alpha(1).restart();
        console.log(d);
    }

    function dragstart(event, d) {
        d3.select(this).classed("fixed", true);
        
        if(last_table_name == null || last_table_name != d.id){
            request_table_metadata(graph.connection, d.id, function (result) {
                //console.log(result);
                updateTableInfo(result)
            });
        }
    }

    function dragged(event, d) {
        d.fx = clamp(event.x, 0, width);
        d.fy = clamp(event.y, 0, height);
        simulation.alpha(1).restart();
    }
}