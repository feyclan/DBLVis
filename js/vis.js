// Global standard value init.
var svgWidth = 1000;
var svgHeight = 1000;

forceProperties = {
    //are not resettable in window
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
    //are not resettable in window

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
};

//Event Listener to draw graph
document.getElementById('visGraph').addEventListener('click', function () {
    document.getElementById('settingsBtn').classList.remove("disabled");
    document.getElementById('infoBtn').classList.remove("disabled");
    drawNodeLinkGraph();
});
//Event Listeners for changing svg dimensions
document.getElementById('width-form').addEventListener('input', function () {
    svgWidth = document.getElementById('width-form').value;
    drawNodeLinkGraph();
});
//Event Listeners for changing svg dimensions
document.getElementById('height-form').addEventListener('input', function () {
    svgHeight = document.getElementById('height-form').value;
    drawNodeLinkGraph();
});


function drawNodeLinkGraph() {
    //Event listeners for changing settings
    try {
        document.getElementById('center_XSliderOutput').onchange = function () {
            forceProperties.center.x = document.getElementById("center_XSliderOutput").value;
            document.getElementById("XSliderOutput-label").textContent = forceProperties.center.x;
            updateAll();
        };
        document.getElementById('center_YSliderOutput').onchange = function () {
            forceProperties.center.y = document.getElementById("center_YSliderOutput").value;
            document.getElementById("YSliderOutput-label").textContent = forceProperties.center.y;
            updateAll();
        };
        document.getElementById('chargeCheck').onchange = function () {
            $("#charge_StrengthSliderOutput").prop("disabled", (_, val) => !val);
            $("#charge_distanceMaxSliderOutput").prop("disabled", (_, val) => !val);
            // Assign standard variables when checkbox is not checked.
            if($('#chargeCheck:checked').val()){
                forceProperties.charge.strength = document.getElementById("charge_StrengthSliderOutput").value;
                forceProperties.charge.distanceMax = document.getElementById("charge_distanceMaxSliderOutput").value;
                document.getElementById("StrengthSliderOutput-label").textContent = forceProperties.charge.strength;
                document.getElementById("distanceMaxSliderOutput-label").textContent = forceProperties.charge.distanceMax;
            } else {
                forceProperties.charge.strength = -50;
                forceProperties.charge.distanceMax = 2000;
                document.getElementById("StrengthSliderOutput-label").textContent = '-50';
                document.getElementById("distanceMaxSliderOutput-label").textContent = '2000';
            }
            updateAll();
        };
        document.getElementById('charge_StrengthSliderOutput').onchange = function () {
            forceProperties.charge.strength = document.getElementById("charge_StrengthSliderOutput").value;
            document.getElementById("StrengthSliderOutput-label").textContent = forceProperties.charge.strength;
            updateAll();
        };
        document.getElementById('charge_distanceMaxSliderOutput').onchange = function () {
            forceProperties.charge.distanceMax = document.getElementById("charge_distanceMaxSliderOutput").value;
            document.getElementById("distanceMaxSliderOutput-label").textContent = forceProperties.charge.distanceMax;
            updateAll();
        };
        document.getElementById('linkCheck').onchange = function () {
            $("#link_DistanceSliderOutput").prop("disabled", (_, val) => !val);
            // Assign standard variables when checkbox is not checked.
            if($('#linkCheck:checked').val()){
                forceProperties.link.distance = document.getElementById("link_DistanceSliderOutput").value;
                document.getElementById("DistanceSliderOutput-label").textContent = forceProperties.link.distance;
            } else {
                forceProperties.link.distance = 30;
                document.getElementById("DistanceSliderOutput-label").textContent = '30';
            }
            updateAll();
        };
        document.getElementById('link_DistanceSliderOutput').onchange = function () {
            forceProperties.link.distance = document.getElementById("link_DistanceSliderOutput").value;
            document.getElementById("DistanceSliderOutput-label").textContent = forceProperties.link.distance;
            updateAll();
        };
        document.getElementById('collideCheck').onchange = function () {
            forceProperties.collide.enabled = !!$('#linkCheck:checked').val();
            updateAll();
        };
    } catch (e) {
        
    }
    //loading .json - file
    d3.json("uploads/parsed/miserables.json", function(error, _graph) {
        if (error) throw error;
        graph = _graph;
        startDisplay();
        startSimulation();
    });


//defining variables
    var svg = d3.select("#visSVG")
            .attr("width", svgWidth)
            .attr("height", svgHeight),
        width = svgWidth,
        height = svgHeight,
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
        svg.selectAll("*").remove();

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
        document.getElementById('nodeName').textContent = d3.event.subject.id;
        document.getElementById('nodeX').textContent = d3.event.subject.x;
        document.getElementById('nodeY').textContent = d3.event.subject.y;
    }

    function dragging(d) {
        d.fx = d3.event.x;//save new x-location after you change location of node
        d.fy = d3.event.y;//save new y-location after you change location of node
    }

    function updateAll() {
        updateForces();
        updateDisplay();
    }
}