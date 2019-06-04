import { netClustering } from "./netclustering.js";

export function cluster(graph){
    //Prepare Graph for clustering
    graph.nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
    });

    console.log(graph);
    let clusterNodes = [];
    let counter;
    //Cluster algorithm
    let clusters = netClustering.cluster(graph.nodes, graph.links);
    console.log(clusters);
    //Find total amount of clusters (0 to max)
    graph.max = Math.max.apply(Math, graph.nodes.map(function(m) { return m.cluster; })) + 1;
    counter = graph.max + 1;
    for(let i = 0; i < graph.max; i++){
        clusterNodes.push({
            node : 'cluster'+i,
            children : setChildren(clusters[i], graph, counter)
        });
    }
    console.log(clusterNodes);
    return graph;
}


function setChildren(clusters, graph, counter){
    let tempArr = [];
    clusters.forEach(function (c) {
        if(c instanceof Array) {
            tempArr.push({id : 'cluster'+counter, children : setChildren(c, graph, counter++)});
        }else{
            tempArr.push({
                id : graph.nodes[c].id,
                index: graph.nodes[c].index
            });
        }
    });
    return tempArr;
}
