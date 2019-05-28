/*
  @author: Sebastiaan Eddy Gerritsen
  @date: 07-05-2019 (dd/mm/yyyy)
  @comment: Code for parsing csv files to files usable by the d3.js library.
*/
//Global variables
// Array that stores the index of every name in key value pairs [[name, index],...]
let indexArray = [];
let tempLinks, tempNodes;
let d3Graph, d3GraphNodes, d3GraphLinks, d3Matrix, d3MatrixNodes, d3MatrixLinks;
//Default parser setting variables
let setWorker, setHeader, setDynamicTyping, setMode;
setWorker = false;
setHeader = true;
setDynamicTyping = true;
setMode = false;

//Event handler for uploading file
document.getElementById('parserBtn').addEventListener('click', function () {
    init();
});

function init(){
    //Make settings unchangeable during process
    $('#header').attr("disabled", true);
    $('#dynamicTyping').attr("disabled", true);
    $('#worker').attr("disabled", true);
    $('#typeSelect').attr("disabled", true);
    //Set settings according to checkboxes
    setHeader = document.getElementById("header").checked;
    setDynamicTyping = document.getElementById("dynamicTyping").checked;
    setWorker = document.getElementById("worker").checked;
    //Show progress bar
    document.getElementById('progressBar').style.display = "block";
    //Select file and parse
    loadDoc();
}

//Load data.csv into csvFile
function loadDoc() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "uploads/data.csv", true);
    //Set response type
    xhr.responseType = 'blob';
    xhr.addEventListener('load',function(){
        if (xhr.status === 200){
            document.getElementById('progress').style.width = "20%";
            parserCSV(xhr.response);
        }
    });
    xhr.send();
}

// Activates parsers specified in settings
function selector() {
    switch(Number($("#typeSelect option:selected").val())){
        case 1:
            parserNodeLink();
            parserAdjacencyMatrix();
            break;
        case 2:
            parserNodeLink();
            break;
        case 3:
            parserAdjacencyMatrix();
            break;
    }

}

//Parser for CSV to JSON
function parserCSV(csvFile){
    tempLinks = [];
    tempNodes = [];
    Papa.parse(csvFile, {
        //Separate thread for parsing, so the website stays responsive.
        worker: setWorker,
        header: setHeader,
        //Auto detect numbers (Otherwise they stay strings)
        dynamicTyping: setDynamicTyping,
        step: function(row){
            //Push rows of data from csv for the info about links between nodes.
            tempLinks.push(row.data);
            //Only push the information about the nodes once.
            if(!tempNodes.length){tempNodes.push(row.meta.fields)}
        },
        complete: function() {
            document.getElementById('progress').style.width = "50%";
            //Once the csv file is parsed to JSON, move on to selector.
            selector();
        },
        error: function () {
            document.getElementById('parserMsgFail').style.display = "block";
        }
    });
}

//Parser that converts the JSON format to one for D3 NodeLink diagrams.
function parserNodeLink(){
    document.getElementById('progress').style.width = "50%";

    var graphType = 'nodelink';
    d3Graph = [];
    d3GraphNodes = [];
    d3GraphLinks = [];
    //Correction necessary due to format of Papa Parse. (Array inside array, so remove outer one)
    tempNodes = tempNodes[0];
    try {
        for (i = 0; i < tempNodes.length; i++) {
            //Empty nodes are skipped
            if (tempNodes[i] !== "") {
                d3GraphNodes.push({
                    "id": tempNodes[i],
                });
            }
        }
    } catch(e) {
        document.getElementById('parserMsgFail').style.display = "block";
        return;
    }
    //Outside for loop to increase performance
    var tempLinksLength = tempLinks.length;
    //Remembers which sources have already parsed. (This prevents the same nodes to link 2 times)
    var sourceMem = [];
    for(i = 0; i < tempLinksLength ; i++) {
        //Convert object to key value pairs ex: {"key":value,...} -> [[key,value],...]
        var tempLinkArr = Object.entries(tempLinks[i][0]);

        //Outside for loop to increase performance
        var tempLinkArrLength = tempLinkArr.length;
        for(j = 0; j < tempLinkArrLength-1; j++){
            //Check if zero
            let isZero = tempLinkArr[j][1] === 0;
            //Check if target empty
            let isEmptyTarget = tempLinkArr[j][0]; //Returns false if true
            //Check if target has already been source. (duplicate)
            let isDuplicate = sourceMem.includes(tempLinkArr[j][0]);
            //Check if target is equal to source.
            let isEqual = tempLinkArr[0][1] === tempLinkArr[j][0];


            if(!isZero&&isEmptyTarget&&!isDuplicate&&!isEqual) {
                d3GraphLinks.push({
                    "source": tempLinkArr[0][1],
                    "target": tempLinkArr[j][0],
                    "value": tempLinkArr[j][1]
                });
            }
        }
        sourceMem.push(tempLinkArr[0][1]);
    }
    // Store result in Graph object
    d3Graph = {
        nodes : d3GraphNodes,
        links : d3GraphLinks
    };
    document.getElementById('progress').style.width = "70%";
    storeJSON(d3Graph, graphType);
}

//Parser that converts the JSON format to one for D3 Adjacency Matrices.
function parserAdjacencyMatrix(){
    document.getElementById('progress').style.width = "50%";

    var graphType = 'matrix';
    d3Matrix = [];
    d3MatrixNodes = [];
    d3MatrixLinks = [];
    //Correction necessary due to format of Papa Parse. (Array inside array, so remove outer one)
    tempNodes = tempNodes[0];


        for (i = 0; i < tempNodes.length; i++) {
            //Empty nodes are skipped
            if (tempNodes[i] !== "") {
                d3MatrixNodes.push({
                    "id": tempNodes[i],
                });
            }
        }
    //Outside for loop to increase performance
    var tempLinksLength = tempLinks.length;
    //Remembers which sources have already parsed. (This prevents the same nodes to link 2 times)
    var sourceMem = [];
    for(i = 0; i < tempLinksLength ; i++) {
        //Convert object to key value pairs ex: {"key":value,...} -> [[key,value],...]
        var tempLinkArr = Object.entries(tempLinks[i][0]);

        //Outside for loop to increase performance
        var tempLinkArrLength = tempLinkArr.length;
        for(j = 0; j < tempLinkArrLength-1; j++){
            //Check if zero
            let isZero = tempLinkArr[j][1] === 0;
            //Check if target empty
            let isEmptyTarget = tempLinkArr[j][0]; //Returns false if true
            //Check if target has already been source. (duplicate)
            let isDuplicate = sourceMem.includes(tempLinkArr[j][0]);
            //Check if target is equal to source.
            let isEqual = tempLinkArr[0][1] === tempLinkArr[j][0];


            if(!isZero&&isEmptyTarget&&!isDuplicate&&!isEqual) {
                d3MatrixLinks.push({
                    "source": tempNodes.indexOf(tempLinkArr[0][1]),
                    "target": tempNodes.indexOf(tempLinkArr[j][0]),
                    "value": tempLinkArr[j][1]
                });
                console.log(tempNodes.indexOf(tempLinkArr[0][1]));
            }
        }
        sourceMem.push(tempLinkArr[0][1]);
    }
    // Store result in Graph object
    d3Matrix = {
        nodes : d3MatrixNodes,
        links : d3MatrixLinks
    };
    document.getElementById('progress').style.width = "70%";
    storeJSON(d3Matrix, graphType);
}

//Store Graph object in .JSON file on server.
function storeJSON(graphData, graphType) {
    $.ajax
    ({
        type: "POST",
        url: 'php/json_handler.php',
        data: { data: JSON.stringify(graphData), action: graphType},
        success: function () {
            //Display relevant message
            document.getElementById('parserMsgSuccess').style.display = "block";
            document.getElementById('parserMsgFail').style.display = "none";
            document.getElementById('progress').style.width = "100%";
            //Make settings changeable again
            $('#header').removeAttr("disabled");
            $('#dynamicTyping').removeAttr("disabled");
            $('#worker').removeAttr("disabled");
            $('#typeSelect').removeAttr("disabled");
        },
        failure: function() {
            document.getElementById('parserMsgFail').style.display = "block";
        }
    });
}