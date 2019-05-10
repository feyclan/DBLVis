document.getElementById('visNodeLinkBtn').addEventListener('click', function () {
    drawNodeLinkGraph();
});

function drawNodeLinkGraph() {
    var transform = d3.zoomIdentity;

    var graph = {};
    graph.nodes = d3GraphNodes;
    graph.links = d3GraphLinks;

    //defining variables
    var canvas = d3.select("#node-link"),
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
        .force("collide", d3.forceCollide(r+1)) //do not let the nodes collide
        .force("charge", d3.forceManyBody()
            .strength(strength))
        .force("link", d3.forceLink()
            .id(function(d){ return d.name; }));


    function initGraph(tempData){
        function zoomed() { //the function for zooming
            transform = d3.event.transform;
            update(); //redraws the nodes after zooming
        }

        d3.select(canvas)
            .call(d3.drag()
                .subject(dragsubject)
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end",dragended))

            .call(d3.zoom()
                .scaleExtent([1 / 10, 8]) //limits for the zoom
                .on("zoom", zoomed)) //calls the zoomed() func on the canvas
    }
        simulation.nodes(graph.nodes);
        simulation.force("link")
            .links(graph.links);
        simulation.on("tick", update);

        //got these functions from https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
        canvas
            .call(d3.drag()
                .container(canvas.node())
                .subject(dragsubject)
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        canvas.call(d3.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed));

        //drawing
        function update(){
            ctx.clearRect(0, 0, width, height); // clearing drawing

            //updating edges
            ctx.beginPath();
            ctx.globalAlpha = transparancy; //giving transparancy to edges
            ctx.strokeStyle = colorEdges; //colour of edges/clusters
            graph.links.forEach(drawLink); //for each node perform this action
            ctx.stroke(); //draw each link without filling

            //updating nodes
            ctx.globalAlpha = 1.0; //giving transparancy to nodes
            graph.nodes.forEach(drawNode); //for each node perform this action

        }

        //got these functions from https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y);
        }



//function to draw a node
    function drawNode(d){
        ctx.beginPath();
        ctx.fillStyle = color(d.party); //Fill nodes with color
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
        ctx.fill(); //draw each node
    }

//function to draw a edges
    function drawLink(l){
        ctx.moveTo(l.source.x, l.source.y); //startpoint
        ctx.lineTo(l.target.x, l.target.y);//endpoint
    }

//got these functions from https://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048
    function dragstarted() {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;//save x-location before you change location of node
        d3.event.subject.fy = d3.event.subject.y;//save y-location before you change location of node
        console.log(d3.event.subject);//print in console which node you are dragging
    }

    function dragged() {
        d3.event.subject.fx = d3.event.x;//save new x-location after you change location of node
        d3.event.subject.fy = d3.event.y;//save new y-location after you change location of node

    function dragended() {
        if (!d3.event.active) simulation.alphaTarget(0);
        d3.event.subject.fx = null;//reset new x-location to old x-location
        d3.event.subject.fy = null;//reset new y-location to old y-location
    }
    //@author: Lyuben Petrov
    function zoomed() {
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.translate(d3.event.transform.x, d3.event.transform.y);
        ctx.scale(d3.event.transform.k, d3.event.transform.k);
        update();
        ctx.restore();
    }

}