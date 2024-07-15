from data_nexus.log_handle.log import *
from data_nexus.graphs.colors import color_for
import networkx as nx
from community import community_louvain


def graph_to_json(G):
    nodes_list = []
    for n in G.nodes():
        node_data = {"id": n}
        node_data.update(G.nodes[n])
        nodes_list.append(node_data)
    
    links_list = []
    for u, v, k in G.edges(keys=True):
        edge_data = {"source": u, "target": v}
        edge_data.update(G[u][v][k])
        links_list.append(edge_data)

    graph_dict = {
        "nodes": nodes_list,
        "links": links_list
    }
    return graph_dict

def calc_node_size(G, type, centrality_type):
    for n in G.nodes():
        if  G.nodes[n]['ref'] != None:
            
            G.nodes[n]['degree'] = G.degree[n]
            G.nodes[n]['in_degree'] = G.in_degree[n]
            G.nodes[n]['out_degree'] = G.out_degree[n]
            
            if type == 'graph_tuples':
                G.nodes[n]['size'] = G.nodes[n]['ref'].num_tuples
            elif type == 'graph_relationships':
                if centrality_type == 'graph_both':
                    G.nodes[n]['size'] = G.degree[n]
                elif centrality_type == 'graph_prestige':
                    G.nodes[n]['size'] = G.in_degree[n]
                elif centrality_type == 'graph_influence':
                    G.nodes[n]['size'] = G.out_degree[n]
                else:
                    G.nodes[n]['size'] = G.degree[n]
            elif type == 'graph_indexes':
                G.nodes[n]['size'] = len ( G.nodes[n]['ref'].indexes )
            
            G.nodes[n]['ref'] = None
        else:
            log_error(f'Error: table {n} not found for calculate node size.')
       

def generate_graph(tables, type, centrality_type):  
    
    log_info(type)
    log_info(centrality_type)
    
    G = nx.MultiDiGraph()
    for table in tables:
        #log_info("Table: " + table.name)
        G.add_node(table.name, ref=table) #size=table.num_tuples
    
    for table in tables:
        for constraint in table.constraints:
            if constraint.referenced_table_name != table.name and constraint.referenced_table_name is not None:       
                G.add_edge(table.name, constraint.referenced_table_name, weight=1)

    community_detection(G)
    calc_node_size(G, type, centrality_type)
    return graph_to_json(G)


def community_detection(G):
    #result = community_louvain.best_partition(NET, weight='weight')
    #total = max(result.values()) + 1
    
    result = nx.community.greedy_modularity_communities(G, weight='weight')
    total = len(result) 
    #print(f'{total} communities detected')
    for i, community in enumerate(result):    
        for node in community:
            G.nodes[node]['color'] = color_for(i)
            G.nodes[node]['community'] = i
