// based on https://observablehq.com/@d3/clustered-bubbles

function render_graph_community(graph, container_id, width, height) {
    const sizeScale = d3.scaleLog()
        .domain([1, d3.max(graph.nodes, d => d.size)]) // Começando de 1 em vez de 0
        .range([5, 50]); // Define o intervalo para o tamanho dos nós

    function transformGraph(graph) {
        const groupedData = new Map();

        graph.nodes.forEach(node => {
            const group = node.community;
            let value = 5; // node.size;
            let color = node.color;
            let degree = node.degree;
            let in_degree = node.in_degree;
            let out_degree = node.out_degree;

            if (node.size !== undefined) {
                value = Math.max(5, sizeScale(Math.max(1, node.size)));
            }

            if (!groupedData.has(group)) {
                groupedData.set(group, []);
            }
            groupedData.get(group).push({ group: group, value: value, color: color, id: node.id
                , degree: degree, in_degree: in_degree, out_degree: out_degree
             });
        });

        const numberOfNodes = graph.nodes.length;
        const numberOfGroups = groupedData.size;

        console.log('Number of nodes:', numberOfNodes);
        console.log('Number of communities:', numberOfGroups);

        const result = {
            children: Array.from(groupedData.values()).map(children => ({ children: children }))
        };

        return result;
    }

    const data = transformGraph(graph);

    function forceCluster() {
        const strength = 0.2;
        let nodes;

        function force(alpha) {
            const centroids = d3.rollup(nodes, centroid, d => d.data.group);
            const l = alpha * strength;
            for (const d of nodes) {
                const { x: cx, y: cy } = centroids.get(d.data.group);
                d.vx -= (d.x - cx) * l;
                d.vy -= (d.y - cy) * l;
            }
        }

        force.initialize = _ => nodes = _;

        return force;
    }

    function forceCollide() {
        const alpha = 0.4; // fixed for greater rigidity!
        const padding1 = 5; // separation between same-color nodes
        const padding2 = 30; // separation between different-color nodes
        let nodes;
        let maxRadius;

        function force() {
            const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
            for (const d of nodes) {
                const r = d.r + maxRadius;
                const nx1 = d.x - r, ny1 = d.y - r;
                const nx2 = d.x + r, ny2 = d.y + r;
                quadtree.visit((q, x1, y1, x2, y2) => {
                    if (!q.length) do {
                        if (q.data !== d) {
                            const r = d.r + q.data.r + (d.data.group === q.data.data.group ? padding1 : padding2);
                            let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
                            if (l < r) {
                                l = (l - r) / l * alpha;
                                d.x -= x *= l, d.y -= y *= l;
                                q.data.x += x, q.data.y += y;
                            }
                        }
                    } while (q = q.next);
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            }
        }

        force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);

        return force;
    }

    const pack = () => d3.pack()
        .size([width, height])
        .padding(1)
        (d3.hierarchy(data)
            .sum(d => d.value));

    function centroid(nodes) {
        let x = 0;
        let y = 0;
        let z = 0;
        for (const d of nodes) {
            let k = d.r ** 2;
            x += d.x * k;
            y += d.y * k;
            z += k;
        }
        return { x: x / z, y: y / z };
    }

    const drag = simulation => {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const nodes = pack().leaves();

    const idToNode = {};
    nodes.forEach(node => {
        idToNode[node.data.id] = node;
    });

    // Link data references the nodes directly
    graph.links.forEach(link => {
        link.source = idToNode[link.source];
        link.target = idToNode[link.target];
    });

    const simulation = d3.forceSimulation(nodes)
        .force("x", d3.forceX(width / 2).strength(0.01))
        .force("y", d3.forceY(height / 2).strength(0.01))
        .force("cluster", forceCluster())
        .force("collide", forceCollide());

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

    // Draw links first so they are below nodes
    const link = g
        .selectAll(".link")
        .data(graph.links)
        .join("line")
        .classed("link", true)
        .attr("marker-end", "url(#"+arrow_id+")")  // Adicione esta linha
        .style("stroke", "lightgray")
        .style("stroke-width", 1);

    const node = g
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("table_id", d => d.data.id)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => d.data.color)
        .attr("cursor", "move")
        .call(drag(simulation))
        .on("click", function (event, d) {
            console.log(d);
            request_table_metadata(graph.connection, d.data.id, function (result) {
                //console.log(result);
                updateTableInfo(result)
            });
        })
        .on("mouseover",function(event, d){
            d3.select(this).style("stroke", "#ff0000");
            d3.select(this).style("stroke-width", 3);
            for (let i = 0; i < graph.links.length; i++) {
                if (graph.links[i].source.data.id === d.data.id) {
                    const n = g.selectAll("circle").filter(function(d) { return d.data.id === graph.links[i].target.data.id;});
                    n.style("stroke", "#ff0000");
                    n.style("stroke-width", 3);
                    
                }
                if (graph.links[i].target.data.id === d.data.id) {
                    const n = g.selectAll("circle").filter(function(d) { return d.data.id === graph.links[i].source.data.id;});
                    n.style("stroke", "#ff0000");
                    n.style("stroke-width", 3);
                }
            }
        }).on("mouseout",function(event, d){
            d3.select(this).style("stroke", "#0000ffff");
            d3.select(this).style("stroke-width", 0);

            for (let i = 0; i < graph.links.length; i++) {
                if (graph.links[i].source.data.id === d.data.id) {
                    const n = g.selectAll("circle").filter(function(d) { return d.data.id === graph.links[i].target.data.id;});
                    n.style("stroke", "#0000ffff");
                    n.style("stroke-width", 0);
                    
                }
                if (graph.links[i].target.data.id === d.data.id) {
                    const n = g.selectAll("circle").filter(function(d) { return d.data.id === graph.links[i].source.data.id;});
                    n.style("stroke", "#0000ffff");
                    n.style("stroke-width", 0);
                }
            }

        })


    node.transition()
        .delay((d, i) => Math.random() * 500)
        .duration(750)
        .attrTween("r", d => {
            const i = d3.interpolate(0, d.r);
            return t => d.r = i(t);
        });

    let count = 1;
    const text = g
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .attr("dy", "0.35em")
        .attr("font-size", d => {
           // const diameter = d.r * 2; // Calcula o diâmetro do nó
           // return Math.min(diameter / 2, 10); // Ajusta o tamanho do texto baseado no diâmetro do nó

            const diameter = d.r * 2; // Calcula o diâmetro do nó
            const textContent = d.data.id;
            const maxFontSize = 48; // Tamanho máximo da fonte
            let fontSize = maxFontSize;

            // Reduzir o tamanho da fonte até que o texto caiba no círculo
            while (fontSize > 1 && getTextLength(textContent, fontSize) > diameter - 10) {
                fontSize -= 1;
            }
            console.log(fontSize);
            return fontSize;
        })
        .attr("fill", "black")
        .text(d => {
            const textContent = d.data.id;
            /*
            const diameter = d.r * 2; // Calcula o diâmetro do nó
            const maxLength = diameter - 10; // Ajuste para margem, você pode ajustar conforme necessário

            // Calcula o comprimento do texto para decidir se precisa truncar
            const textLength = getTextLength(textContent, Math.min(diameter / 2, 10));
            //if (1==1) return "T"+count++;

            if (textLength > maxLength) {
                return truncateText(textContent, maxLength);
            } else {
                return textContent;
            }
            */
           return textContent
        });

    // Função para calcular o comprimento do texto baseado no tamanho da fonte
    function getTextLength(text, fontSize) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = `${fontSize}px sans-serif`;
        return context.measureText(text).width;
    }

    // Função para truncar o texto e adicionar "..."
    function truncateText(text, maxLength) {
        const ellipsis = "...";
        let truncatedText = text;

        while (truncatedText.length > 0 && getTextLength(truncatedText + ellipsis, 10) > maxLength) {
            truncatedText = truncatedText.slice(0, -1);
        }

        return truncatedText + ellipsis;
    }




    simulation.on("tick", () => {
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => {
              //  console.log(d);
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const normX = dx / dist;
                const normY = dy / dist;
                const targetRadius = Math.max(5, sizeScale(Math.max(1, d.target.value)));
                return d.target.x - normX * targetRadius;
            })
            .attr("y2", d => {
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const normX = dx / dist;
                const normY = dy / dist;
                const targetRadius = Math.max(5, sizeScale(Math.max(1, d.target.value)));
                return d.target.y - normY * targetRadius;
            });
    });

    const zoom = d3.zoom()
        .scaleExtent([0.1, 20])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity
        .scale(0.9)
        .translate(width / 5, 0));
}
