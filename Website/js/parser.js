/*
  @author: Sebastiaan Eddy Gerritsen
  @date: 07-05-2019 (dd/mm/yyyy)
  @comment: Code for parsing csv files to files usable by the d3.js library.
*/
//Global variables
var tempLinks;
var tempNodes;

var d3GraphNodes;
var d3GraphLinks;
//Event handler for uploading file
document.getElementById('uploadBtn').onchange = function(){
    //Select file
    const csvFile = document.getElementById('uploadBtn').files[0];
    //Call parser function
    parserCSV(csvFile);
};

//Parser for CSV to JSON
function parserCSV(csvFile){
    tempLinks = [];
    tempNodes = [];
    Papa.parse(csvFile, {
        //Separate thread for parsing, so the website stays responsive.
        worker: true,
        header: true,
        //Auto detect numbers (Otherwise they stay strings)
        dynamicTyping: true,
        step: function(row){
            //Push rows of data from csv for the info about links between nodes.
            tempLinks.push(row.data);
            //Only push the information about the nodes once.
            (tempNodes.length) ? (console.log('0')): tempNodes.push(row.meta.fields);
        },
        complete: function() {
            //Once the csv file is parsed to JSON, move on to parser for node-link diagram.
            parserNodeLink();
        }
    });
}

//Parser that converts the JSON format to one for D3 NodeLink diagrams.
function parserNodeLink(){
    d3GraphNodes = [];
    d3GraphLinks = [];
    //Correction necessary due to format of Papa Parse. (Array inside array, so remove outer one)
    tempNodes = tempNodes[0];
    //var tempNodes = [];
    for(i = 0; i < tempNodes.length; i++) {
        if(tempNodes[i] !== "") {
            d3GraphNodes.push({
                "name": tempNodes[i]
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
                d3GraphLinks.push({
                    "source": tempLinkArr[0][1],
                    "target": tempLinkArr[j][0],
                    "value": tempLinkArr[j][1]
                });
            }
        }
        sourceMem.push(tempLinkArr[0][1]);
    }
}