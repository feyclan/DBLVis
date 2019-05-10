//Global variables
//var gHeight, gWidth;


document.getElementById('visGraph').addEventListener('click', function () {
    //Set variables
    //gHeight = document.getElementById('height-form').value;
    //gWidth = document.getElementById('width-form').value;
    //Set canvas
    //document.getElementById('visCanvas').style.width = gWidth;
    //document.getElementById('visCanvas').style.height = gHeight;

    drawNodeLinkGraph();
});

function drawNodeLinkGraph() {
    var canvas = d3.select("#visCanvas"),
        height = canvas.attr("height"),//give height attribute to canvas
        width = canvas.attr("width"),//give width attribute to canvas
        radius = 4, //setting radius of nodes
        colorNodes = "#FFC300", //color of nodes
        colorEdges = "#123", //color of edges
        strength = -50,//change the strength between nodes
        transparancy = 0.03,//change tranparancy of nodes
        ctx = canvas.node().getContext("2d");//make a 2d graph
//end of defining variables

    simulation = d3.forceSimulation()
        .force("x", d3.forceX(width/2)) //put graph in the middle of x-axis of canvas
        .force("y", d3.forceY(height/2))//put graph in the middle of y-axis of canvas
        .force("collide", d3.forceCollide(radius+1)) //do not let the nodes collide and give an even distance between nodes
        .force("charge", d3.forceManyBody()
            .strength(strength))//causes nodes in the graph to repel each other
        .force("link", d3.forceLink()//strength between edges
            .id(function(d){ return d.name; }));


    d3.json("uploads/parsed/data_parsed_node-link.json", function(err, graph){
        if (err) throw err; //loading .json - file

        simulation.nodes(graph.nodes);
        simulation.force("link")
            .links(graph.links);
        simulation.on("tick", update);

        canvas.call(d3.drag()
            .container(canvas.node())
            .subject(dragsubject)
            .on("start", startedTheDragging)
            .on("drag", dragging)
            .on("end", resetDrag));

        //drawing
        function update(){
            ctx.clearRect(0, 0, width, height); //clearing drawing

            //updating edges
            ctx.beginPath();
            ctx.globalAlpha = transparancy; //giving transparancy to edges
            ctx.strokeStyle = colorEdges; //colour of edges/clusters
            graph.links.forEach(drawLink); //for each node perform this action
            ctx.stroke(); //draw each link without filling

            //updating nodes
            ctx.beginPath();
            ctx.globalAlpha = 1.0; //giving transparancy to nodes
            graph.nodes.forEach(drawNode); //for each node perform this action
            ctx.fill(); //draw each node

        }

        //got inspiration for these functions from https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y);//make it possible to drag nodes
        }

    });

//function to draw a node
    function drawNode(d){
        ctx.fillStyle = colorNodes; //Fill nodes with color
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, radius, 0, 2 * Math.PI);
    }

//function to draw a edges
    function drawLink(l){
        ctx.moveTo(l.source.x, l.source.y);//startpoint
        ctx.lineTo(l.target.x, l.target.y);//endpoint
    }

//got inspiration for these functions from https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
    function startedTheDragging() {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;//save x-location before you change location of node
        d3.event.subject.fy = d3.event.subject.y;//save y-location before you change location of node
        document.getElementById('nodeName').textContent = d3.event.subject.name;
        document.getElementById('nodeX').textContent = d3.event.subject.x;
        document.getElementById('nodeY').textContent = d3.event.subject.y;
    }

    function dragging() {
        d3.event.subject.fx = d3.event.x;//save new x-location after you change location of node
        d3.event.subject.fy = d3.event.y;//save new y-location after you change location of node
    }

    function resetDrag() {
        if (!d3.event.active) simulation.alphaTarget(0);
        d3.event.subject.fx = null;//reset new x-location to old x-location
        d3.event.subject.fy = null;//reset new y-location to old y-location
    }
}