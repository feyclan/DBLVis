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
            document.getElementById("YSliderOutput-label").textContent = forceProperties.center.x;
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
    /*
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
    */
}
/*
function drawAdjacencyMatrix(){
    var margin = {top: 150, right: 0, bottom: 10, left: 150},
        width = 1000,
        height = 1000;
    var x = d3.scaleOrdinal().range.bandwidth([0, width]),
        z = d3.scale.linear().domain([0, 4]).clamp(true),
        c = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(10));
    var svg = d3.select("#visDiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-right", -margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.json("uploads/parsed/test.json", function(data) {
        var matrix = [],
            nodes = data.nodes,
            n = nodes.length;
        // Compute index per node.
        nodes.forEach(function(node, i) {
            node.index = i;
            node.count = 0;
            matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
        });
        // Convert links to matrix; count character occurrences.
        data.links.forEach(function(link) {
            matrix[link.source][link.target].z += link.value;
            matrix[link.target][link.source].z += link.value;
            //matrix[link.source][link.source].z += link.value;
            //matrix[link.target][link.target].z += link.value;
            nodes[link.source].count += link.value;
            nodes[link.target].count += link.value;
        });
        // Precompute the orders.
        var orders = {
            name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
            count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
            group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
        };
        // The default sort order.
        x.domain(orders.name);
        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);
        var row = svg.selectAll(".row")
            .data(matrix)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
            .each(row);
        row.append("line")
            .attr("x2", width);
        row.append("text")
            .attr("x", -6)
            .attr("y", x.range.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .text(function(d, i) { return nodes[i].name; });
        var column = svg.selectAll(".column")
            .data(matrix)
            .enter().append("g")
            .attr("class", "column")
            .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
        column.append("line")
            .attr("x1", -width);
        column.append("text")
            .attr("x", 6)
            .attr("y", x.range.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "start")
            .text(function(d, i) { return nodes[i].name; });
        function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function(d) { return d.z; }))
                .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function(d) { return x(d.x); })
                .attr("width", x.range.bandwidth())
                .attr("height", x.range.bandwidth())
                .style("fill-opacity", function(d) { return z(d.z); })
                .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
        }
        function mouseover(p) {
            d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
            d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
        }
        function mouseout() {
            d3.selectAll("text").classed("active", false);
        }
        d3.select("#order").on("change", function() {
            clearTimeout(timeout);
            order(this.value);
        });
        function order(value) {
            x.domain(orders[value]);
            var t = svg.transition().duration(2500);
            t.selectAll(".row")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
                .selectAll(".cell")
                .delay(function(d) { return x(d.x) * 4; })
                .attr("x", function(d) { return x(d.x); });
            t.selectAll(".column")
                .delay(function(d, i) { return x(i) * 4; })
                .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
        }
        var timeout = setTimeout(function() {
            order("group");
            d3.select("#order").property("selectedIndex", 2).node().focus();
        }, 5000);
    });
}

 */