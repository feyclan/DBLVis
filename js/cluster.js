import {jLouvain} from "./jLouvain.js";

export function clusterNodeGraph(data, recluster, type) {
    return new Promise(function (resolve) {
        //Array containing partitions
        //var partition = {"Jim_Thomas":1,"Lawrence_A._Rowe":1};
        //Array containing all node names
        var nodeArr = [];
        //Array containing all clusters with their children (index = cluster, array on index = children)
        var clusterArr = [];
        //Array containing all source and target combinations that have been seen.
        var keyArr = [];
        //New Graph with clusters
        var newGraph = {
            nodes : [],
            links : []
        };
        var counter_nodes = 0;

        if(recluster) {
            data.nodes.forEach(function (e) {
                nodeArr.push(e);
            });
        } else {
            switch (type) {
                case 'node':
                    data.nodes.forEach(function (e) {
                        nodeArr.push(e.id);
                    });
                    break;
                case 'matrix':
                    data.nodes.forEach(function (e) {
                        nodeArr.push(counter_nodes);
                        counter_nodes++;
                    });
                    counter_nodes = 0;
                    break;
            }
        }

        var community = jLouvain().nodes(nodeArr).edges(data.links);//.partition_init(partition);
        community = Object.entries(community());

        switch (type) {
            case 'node':
                community.forEach(function (e) { //e = [id, cluster]
                    if(clusterArr[e[1]]){
                        clusterArr[e[1]].push(e[0]);
                    }else{
                        clusterArr[e[1]] = [];
                        clusterArr[e[1]].push(e[0]);
                    }
                });
                break;
            case 'matrix':
                community.forEach(function (e) { //e = [id, cluster]
                    if(clusterArr[e[1]]){
                        clusterArr[e[1]].push(parseInt(e[0]));
                    }else{
                        clusterArr[e[1]] = [];
                        clusterArr[e[1]].push(parseInt(e[0]));
                    }
                });
                break;
        }

        //Create new nodes
        clusterArr.forEach(function (e) { //e = [child, ...]
            newGraph.nodes.push({id: counter_nodes, children: e, count: e.length});
            counter_nodes++;
        });

        //Create new links
        data.links.forEach(function (e) { //e = {source: , target:, value:}
            var src = getIndexOf(clusterArr, e.source);
            var tar = getIndexOf(clusterArr, e.target);
            var index = keyArr.indexOf(src.toString() + tar.toString());

            //Only add links if the source is not equal to the target
            if(!(src === tar)){
                //Check if source target combination already exists
                if(index >= 0){
                    newGraph.links[index].value += e.value;
                }else{
                    keyArr.push(src.toString() + tar.toString());
                    newGraph.links.push({source:src, target:tar, value:e.value});
                }
            }
        });
        //[USED FOR DEBUGGING]
        /*
        console.log(data);
        console.log(keyArr);
        console.log(community);
        console.log(nodeArr);
        console.log(clusterArr);
        console.log(newGraph);
         */

        //Set total amount of (new) clusters
        newGraph.total = newGraph.nodes.length;
        resolve(newGraph);
    });
}

function getIndexOf(arr, el) {
    for (var i = 0; i < arr.length; i++) {
            var index = arr[i].indexOf(el);
            if (index > -1) {
                return i;
            }
    }
}

//Function used for reclustering.
export function prepareCluster(node, graphOrigin, graph, clusterZoom, type){
    return new Promise(function (resolve) {
        var tempGraph = {links:[]};
        tempGraph.nodes = node.children;

        //Find all links inside clicked cluster
        graphOrigin.links.forEach(function(e){ // e = {source:, target:, value:}
            if((tempGraph.nodes.indexOf(e.source) >= 0)&&(tempGraph.nodes.indexOf(e.target)>= 0)){
                tempGraph.links.push(e);
            }
        });

        //Cluster te children from the clicked node
        clusterNodeGraph(tempGraph, true, type).then(function (clusterGraph) {
            if(clusterZoom) {
                //Prepare clusterGraph for addition to d3 graph
                graph.nodes = [];
                graph.links = [];
                graph.total = clusterGraph.total;
                //Add new clusters
                clusterGraph.nodes.forEach(function (e) { // e = {id:, children:, count:}
                    graph.nodes.push(e);
                });
                //Add new links that were inside of cluster
                clusterGraph.links.forEach(function (e) { // e = {source:, target:, value:}
                    graph.links.push(e);
                });
                resolve(graph);
            } else {
                //Prepare clusterGraph for addition to d3 graph
                clusterGraph.links.forEach(function(e){ // e = {source:, target:, value:}
                    e.source += graph.total;
                    e.target += graph.total;
                });
                clusterGraph.nodes.forEach(function(e){ // e = {id:, children:, count:}
                    e.id += graph.total;
                });
                graph.total += clusterGraph.total;
                //Remove clicked cluster (will be replaced by subclusters/nodes)
                graph.nodes = graph.nodes.filter(el => el.id !== node.id);
                //Remove links to/from clicked cluster
                graph.links = graph.links.filter(el => el.target.id !== node.id);
                graph.links = graph.links.filter(el => el.source.id !== node.id);
                //Add new clusters
                clusterGraph.nodes.forEach(function (e) { // e = {id:, children:, count:}
                    graph.nodes.push(e);
                });
                //Add new links that were inside of cluster
                clusterGraph.links.forEach(function (e) { // e = {source:, target:, value:}
                    graph.links.push(e);
                });
                //Add new links that were outside of cluster
                //Find all links outside clicked cluster
                graphOrigin.links.forEach(function(e){ // e = {source:, target:, value:}
                    if((tempGraph.nodes.indexOf(e.source) >= 0)&&!(tempGraph.nodes.indexOf(e.target)>= 0) || !(tempGraph.nodes.indexOf(e.source) >= 0)&&(tempGraph.nodes.indexOf(e.target)>= 0)){
                        //In case of same target & source value is overwritten, not bad but should be fixed!
                        var source = findOrigin(e.source, graph.nodes);
                        var target = findOrigin(e.target, graph.nodes);
                        //Make sure no undefined targets or sources are inserted into the graph data. May happen when zoom function is turned off and on multiple times.
                        if(source && target) {
                            graph.links.push({source:source, target:target, value: e.value});
                        }
                    }
                });
                //console.log(graph);
                resolve(graph);
            }
        });
    });
}

function findOrigin(id, nodeArr) {
    for(let i = 0; i < nodeArr.length; i++){
        //console.log(nodeArr[i]);
        for(let j = 0; j < nodeArr[i].children.length; j++){
            //console.log(nodeArr[i].children[j]);
            var temp = nodeArr[i].children[j];
            if( temp === id){
                return nodeArr[i].id;
            }
        }
    }
}

/*
    return new Promise(function (resolve) {
        //Array containing partitions
        //var partition = {"Jim_Thomas":1,"Lawrence_A._Rowe":1};
        //Array containing all node names
        var nodeArr = [];
        //Array containing all clusters with their children (index = cluster, array on index = children)
        var clusterArr = [];
        //Array containing all source and target combinations that have been seen.
        var keyArr = [];
        //New Graph with clusters
        var newGraph = {
            nodes : [],
            links : []
        };
        var counter_nodes = 0;

        if(recluster){
            data.nodes.forEach(function (e) {
                nodeArr.push(e);
            });
        }else{
            data.nodes.forEach(function (e) {
                nodeArr.push(e.id);
            });
        }
        console.log(data.nodes);
        console.log(nodeArr);
        console.log(data.links);
        var community = jLouvain().nodes(nodeArr).edges(data.links);//.partition_init(partition);
        community = Object.entries(community());

        community.forEach(function (e) { //e = [id, cluster]
            if(clusterArr[e[1]]){
                clusterArr[e[1]].push(e[0]);
            }else{
                clusterArr[e[1]] = [];
                clusterArr[e[1]].push(e[0]);
            }
        });

        clusterArr.forEach(function (e) { //e = [child, ...]
            newGraph.nodes.push({id: counter_nodes, children: e, count: e.length});
            counter_nodes++;
        });

        data.links.forEach(function (e) { //e = {source: , target:, value:}
            var src = getIndexOf(clusterArr, e.source);
            var tar = getIndexOf(clusterArr, e.target);
            var index = keyArr.indexOf(src.toString() + tar.toString());

            //Check if source target combination already exists
            if(index >= 0){
                newGraph.links[index].value += e.value;
            }else{
                keyArr.push(src.toString() + tar.toString());
                newGraph.links.push({source:src, target:tar, value:e.value});
            }
        });
        //[USED FOR DEBUGGING]

        console.log(data);
        console.log(keyArr);
        console.log(community);
        console.log(nodeArr);
        console.log(clusterArr);
        console.log(newGraph);

newGraph.total = newGraph.nodes.length;
resolve(newGraph);
});

 */