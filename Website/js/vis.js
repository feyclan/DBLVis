document.getElementById('visNodeLinkBtn').addEventListener('click', function () {
    drawNodeLinkGraph();
});


function drawNodeLinkGraph() {
    /* global d3 */
    var graph = {};
    graph.nodes = d3GraphNodes;
    graph.links = d3GraphLinks;

    var canvas = d3.select("#network"),
        width = canvas.attr("width"),
        height = canvas.attr("height"),
        r = 3,
        ctx = canvas.node().getContext("2d");
    simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .force("collide", d3.forceCollide(r + 1)) //do not let the nodes collide
        .force("charge", d3.forceManyBody()
            .strength(-20))
        .force("link", d3.forceLink()
            .id(function (d) {
                return d.name;
            }))
        .on("tick", update);

    //graph.nodes.forEach(function(d){
    //	d.x = Math.random() * width;
    //	d.y = Math.random() * height;
    //});

    //d3.json("VotacionesSenado2017.json", function(err, graph){
    //	if (err) throw err;
    //}); //loading .json - file

    simulation.nodes(graph.nodes);//assign node
    simulation.force("link")
        .links(graph.links);

    //drawing
    function update() {
        ctx.clearRect(0, 0, width, height); // clearing drawing

        ctx.beginPath();
        graph.links.forEach(drawLink); //for each node perform this action
        ctx.stroke(); //draw each link without filling

        ctx.beginPath();
        graph.nodes.forEach(drawNode); //for each node perform this action
        ctx.fill(); //draw each node
    }

    //function to draw a node
    function drawNode(d) {
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    }

    //function to draw a edges
    function drawLink(l) {
        ctx.moveTo(l.source.x, l.source.y); //startpoint
        ctx.lineTo(l.target.x, l.target.y);//endpoint
    }

    update();

}