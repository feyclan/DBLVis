/*
  @author: Sebastiaan Eddy Gerritsen
  @date: 05-06-2019
  @comment: Code for parsing csv files to files usable by the d3.js library.
*/
//Global variables
var tempLinks = [];
var tempNodes = [];

var d3GraphNodes = [];
var d3GraphLinks = [];
//Event handler for uploading file
document.getElementById('uploadBtn').onchange = function(){
    //Select file
    const csvFile = document.getElementById('uploadBtn').files[0];
    //Call parser function
    parserCSV(csvFile);
};

//Parser for CSV to JSON
function parserCSV(csvFile){
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
    //Correction necessary due to format of Papa Parse. (Array inside array, so remove outer one)
    tempNodes = tempNodes[0];
    for(i = 0; i < tempNodes.length; i++) {

        d3GraphNodes.push({
           "name" : tempNodes[i]
        });
    }
    //Outside for loop to increase performance
    var tempLinksLength = tempLinks.length;
    for(i = 0; i < tempLinksLength ; i++) {
        //Convert object to key value pairs ex: {"key":value,...} -> [[key,value],...]
        var tempLinkArr = Object.entries(tempLinks[i][0]);

        //Outside for loop to increase performance
        var tempLinkArrLength = tempLinkArr.length;
        /*
         J is set to two because first 2 key value pairs are irrelevant. These contain the source and value to itself.
         (Which is always 1)
        */
        for(j = 2; j < tempLinkArrLength-1; j++){
            d3GraphLinks.push({
                "source" : tempLinkArr[0][1],
                "target" : tempLinkArr[j][0],
                "value"  : tempLinkArr[j][1]
            });
        }
    }
}