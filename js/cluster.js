import {jLouvain} from "./jLouvain.js";

export function clusterNodeGraph(data) {
    return new Promise(function (resolve) {
        //Array containing partitions
        var partition = {"Jim_Thomas":1,"Lawrence_A._Rowe":1};
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

        data.nodes.forEach(function (e) {
           nodeArr.push(e.id);
        });

        //console.log(nodeArr);
        //console.log(data.links);
        var community = jLouvain().nodes(nodeArr).edges(data.links).partition_init(partition);
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
        /*
        console.log(community);
        console.log(nodeArr);
        console.log(clusterArr);
        console.log(newGraph);
        console.log(community);
         */

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