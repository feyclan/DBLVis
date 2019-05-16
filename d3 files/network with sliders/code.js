//loading .json - file
d3.json("miserables.json", function(error, _graph) {
  if (error) throw error;
  graph = _graph;
  startDisplay();
  startSimulation();
});

// setting startingvalues for all parameters
forceProperties = {
    //are not resetable in window
    X: {
        enabled: false,
        strength: .1,
        x: .5
    },
    Y: {
        enabled: false,
        strength: .1,
        y: .5
    },
     //are not resetable in window

    center: {
        x: 0.5, //display in middle of x-axis
        y: 0.5  //display in middle of y-axis
    },

    charge: {
        enabled: true, //charge box is checked
        strength: -50, //zoom in or out
        distanceMax: 2000 // distance between nodes
    },

    collide: {
        enabled: true, //collide box is checked
        radius: 4     //setting radius of nodes at 4
    },
    
    link: {
        enabled: true, //link box is checked
        distance: 30,
    }
}


//defining variables
var svg = d3.select("svg"),
    width = 1000,
    height = 1000,
    simulation = d3.forceSimulation(),
    graph,
    link, 
    node;
//defining variables

function startSimulation() {
  simulation.nodes(graph.nodes);
  startForce();
  simulation.on("tick", update);
}


function startForce() {
    simulation
        .force("X", d3.forceX())//put graph in the middle of x-axis of canvas
        .force("Y", d3.forceY())//put graph in the middle of y-axis of canvas
        .force("center", d3.forceCenter())
        .force("collide", d3.forceCollide())//do not let the nodes collide and give an even distance between nodes
        .force("charge", d3.forceManyBody())//causes nodes in the graph to repel each other
        .force("link", d3.forceLink());//strength between edges
    // apply properties to each of the forces
    updateForces();
}

// apply new force properties
function updateForces() {
    // get each force by name and update the properties
    simulation.force("center")
        .x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);
    simulation.force("charge")
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMax(forceProperties.charge.distanceMax);
    simulation.force("collide")
        .radius(forceProperties.collide.radius);
    simulation.force("X")
        .strength(forceProperties.X.strength * forceProperties.X.enabled)
        .x(width * forceProperties.X.x);
    simulation.force("Y")
        .strength(forceProperties.Y.strength * forceProperties.Y.enabled)
        .y(height * forceProperties.Y.y);
    simulation.force("link")
        .id(function(d) {return d.id;})
        .distance(forceProperties.link.distance)
        .links(forceProperties.link.enabled ? graph.links : []);//draws the links or deletes them

    simulation.alpha(1).restart();
}


function startDisplay() {
  link = svg.append("g")
        .attr("class", "links")
        .attr("stroke", "red")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");

  node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("fill", "blue")
        .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
        .call(d3.drag()
            .on("start", startedTheDragging)
            .on("drag", dragging));


  updateDisplay();
}

function updateDisplay() {
    node
        .attr("r", forceProperties.collide.radius)
        .attr("stroke-width", 0.5);

    link
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.2);
}

// update the display positions after each simulation tick
function update() {
    link
        .attr("x1", function(d) { return d.source.x; })//x-coordinate of startpoint
        .attr("y1", function(d) { return d.source.y; })//y-coordinate of startpoint
        .attr("x2", function(d) { return d.target.x; })//x-coordinate of endpoint
        .attr("y2", function(d) { return d.target.y; });//x-coordinate of endpoint

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

function startedTheDragging(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.fx = d3.x;//save x-location before you change location of node
  d3.fy = d3.y;//save y-location before you change location of node
  console.log(d3.event.subject);//print in console which node you are dragging
}

function dragging(d) {
  d.fx = d3.event.x;//save new x-location after you change location of node
  d.fy = d3.event.y;//save new y-location after you change location of node
}

function updateAll() {
    updateForces();
    updateDisplay();
}