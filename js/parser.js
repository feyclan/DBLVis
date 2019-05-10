/*
  @author: Sebastiaan Eddy Gerritsen
  @date: 07-05-2019 (dd/mm/yyyy)
  @comment: Code for parsing csv files to files usable by the d3.js library.
*/
//Global variables
let tempLinks, tempNodes;
let d3Graph, d3GraphNodes, d3GraphLinks;
//Default parser setting variables
let setWorker, setHeader, setDynamicTyping, setMode;
setWorker = false;
setHeader = true;
setDynamicTyping = true;
setMode = false;

//Event handler for uploading file
document.getElementById('parserBtn').addEventListener('click', function () {
    //Set settings according to checkboxes
    setHeader = document.getElementById("header").checked;
    setDynamicTyping = document.getElementById("dynamicTyping").checked;
    setWorker = document.getElementById("worker").checked;
    setMode = document.getElementById("fastMode").checked;
    //Show progress bar
    document.getElementById('progressBar').style.display = "block";
    //Select file and parse
    loadDoc();
});

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

//Parser for CSV to JSON
function parserCSV(csvFile){
    tempLinks = [];
    tempNodes = [];
    Papa.parse(csvFile, {
        //Separate thread for parsing, so the website stays responsive.
        worker: setWorker,
        header: setHeader,
        fastMode: setMode,
        //Auto detect numbers (Otherwise they stay strings)
        dynamicTyping: setDynamicTyping,
        step: function(row){
            //Push rows of data from csv for the info about links between nodes.
            tempLinks.push(row.data);
            //Only push the information about the nodes once.
            (tempNodes.length) ? (console.log('0')): tempNodes.push(row.meta.fields);
        },
        complete: function() {
            document.getElementById('progress').style.width = "50%";
            //Once the csv file is parsed to JSON, move on to parser for node-link diagram.
            parserNodeLink();
        },
        error: function () {
            document.getElementById('parserMsgFail').style.display = "block";
        }
    });
}

//Parser that converts the JSON format to one for D3 NodeLink diagrams.
function parserNodeLink(){
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
                    "name": tempNodes[i]
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
    storeJSON();
}

//Store Graph object in .JSON file on server.
function storeJSON() {
    $.ajax
    ({
        type: "POST",
        url: 'php/json_handler.php',
        data: { data: JSON.stringify(d3Graph) },
        success: function () {
            document.getElementById('parserMsgSuccess').style.display = "block";
            document.getElementById('parserMsgFail').style.display = "none";
            document.getElementById('progress').style.width = "100%";
        },
        failure: function() {
            document.getElementById('parserMsgFail').style.display = "block";
        }
    });
}