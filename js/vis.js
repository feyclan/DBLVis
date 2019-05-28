// Import functions from other .js files, needed to build the GUI.
import { rebuildColorPicker } from './jscolor.js';
import { guiInit, guiOptionInit } from './guiBuilder.js';

// Global standard value init.
var svgWidth = 1000,
    svgHeight = 1000,
    // Graph types that are not yet selected are 1, otherwise 0. [None, Node Link force, adjacency matrix]
    typeAvailable = [0,1,1],
    nodeColor = '#007bff',
    linkColor = '#D0D0D0',
    linkOpacity = 0.5;

var forceProperties = {
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

document.getElementById('addGraph').addEventListener('click', function () {
    addGraph();
});

//Select appropriate graph for global settings
function typeSelector(index, type) {
    switch(parseInt(type)){
        case 2 :
            drawNodeLinkGraph(index);
        break;
        case 3 :
            drawAdjacencyMatrix(index);
        break;
    }
}

function addGraph(){
        // Finding total number of elements added
        var total_element = $(".element").length;

        // last <div> with element class id
        var lastid = $(".element:last").attr("id");
        var split_id = lastid.split("-");
        var nextIndex = Number(split_id[1]) + 1;

        var max = 5;
        // Check total number elements
        if(total_element < max ){
            // Adding new div container after last occurance of element class
            $(".element:last").after("<div class='element' id='div-"+ nextIndex +"'></div>");
            //Build GUI
            guiInit(nextIndex);
            //Disable graphs which are already selected.
            for(let i = 0; i < typeAvailable.length; i++) {
                if(typeAvailable[i] === 0) {
                    document.getElementById('visTypeSelect-' + nextIndex).options[i].disabled = true;
                }
            }

            document.getElementById('visTypeSelect-' + nextIndex).addEventListener('change', function () {
                document.getElementById('visGraph-' + nextIndex).classList.remove("disabled");
                document.getElementById('settingsBtn-' + nextIndex).classList.remove("disabled");
                document.getElementById('visTypeSelect-' + nextIndex).disabled = true;


                var sel = document.getElementById('visTypeSelect-' + nextIndex),
                type = sel.options[sel.selectedIndex].value;
                typeAvailable[type-1] = 0;

                guiOptionInit(nextIndex, type).then(function (){
                    interactiveGraph(nextIndex, type);
                    rebuildColorPicker();
                });

            });

        }
}


function interactiveGraph(index, type){
    //Event Listener to draw graph
    document.getElementById('visGraph-' + index).addEventListener('click', function () {
        document.getElementById('infoBtn-' + index).classList.remove("disabled");
        document.getElementById('visBtn-' + index).classList.remove("disabled");
        $('#visSVG-' + index).empty();
        typeSelector(index, type);
    });
    //Event Listeners for changing svg dimensions
    document.getElementById('width-form-' + index).addEventListener('input', function () {
        svgWidth = document.getElementById('width-form-' + index).value;
        $('#visSVG-' + index).empty();
        typeSelector(index, type);
    });
    //Event Listeners for changing svg dimensions
    document.getElementById('height-form-' + index).addEventListener('input', function () {
        svgHeight = document.getElementById('height-form-' + index).value;
        $('#visSVG-' + index).empty();
        typeSelector(index, type);
    });
}



function drawNodeLinkGraph(index) {

    //Event listeners for changing settings
    try {
        document.getElementById('center_X-' + index).onchange = function () {
            forceProperties.center.x = document.getElementById('center_X-' + index).value;
            document.getElementById('X-label-' + index).textContent = forceProperties.center.x;
            updateAll();
        };
        document.getElementById('center_Y-' + index).onchange = function () {
            forceProperties.center.y = document.getElementById('center_Y-' + index).value;
            document.getElementById('Y-label-' + index).textContent = forceProperties.center.y;
            updateAll();
        };
        document.getElementById('chargeCheck-' + index).onchange = function () {
            $('#charge_Strength-' + index).prop("disabled", (_, val) => !val);
            $('#charge_distanceMax-' + index).prop("disabled", (_, val) => !val);
            // Assign standard variables when checkbox is not checked.
            if($('#chargeCheck-'+ index +':checked').val()){
                forceProperties.charge.strength = document.getElementById('charge_Strength-' + index).value;
                forceProperties.charge.distanceMax = document.getElementById('charge_distanceMax-' + index).value;
                document.getElementById('Strength-label-' + index).textContent = forceProperties.charge.strength;
                document.getElementById('distanceMax-label-' + index).textContent = forceProperties.charge.distanceMax;
            } else {
                forceProperties.charge.strength = -50;
                forceProperties.charge.distanceMax = 2000;
                document.getElementById('Strength-label-' + index).textContent = '-50';
                document.getElementById('distanceMax-label-' + index).textContent = '2000';
            }
            updateAll();
        };
        document.getElementById('charge_Strength-' + index).onchange = function () {
            forceProperties.charge.strength = document.getElementById('charge_Strength-' + index).value;
            document.getElementById('Strength-label-' + index).textContent = forceProperties.charge.strength;
            updateAll();
        };
        document.getElementById('charge_distanceMax-' + index).onchange = function () {
            forceProperties.charge.distanceMax = document.getElementById('charge_distanceMax-' + index).value;
            document.getElementById('distanceMax-label-' + index).textContent = forceProperties.charge.distanceMax;
            updateAll();
        };
        document.getElementById('linkCheck-' + index).onchange = function () {
            $('#link_Distance-'+ index).prop("disabled", (_, val) => !val);
            // Assign standard variables when checkbox is not checked.
            if($('#linkCheck'+ index +':checked').val()){
                forceProperties.link.distance = document.getElementById('link_Distance-' + index).value;
                document.getElementById('Distance-label-' + index).textContent = forceProperties.link.distance;
            } else {
                forceProperties.link.distance = 30;
                document.getElementById('Distance-label-' + index).textContent = '30';
            }
            updateAll();
        };
        document.getElementById('link_Distance-' + index).onchange = function () {
            forceProperties.link.distance = document.getElementById('link_Distance-' + index).value;
            document.getElementById('Distance-label-' + index).textContent = forceProperties.link.distance;
            updateAll();
        };
        document.getElementById('collideCheck-' + index).onchange = function () {
            forceProperties.collide.enabled = !!$('#linkCheck'+ index +':checked').val();
            updateAll();
        };
        document.getElementById('style_nodeColor-' + index).onchange = function () {
            nodeColor ='#' + document.getElementById('style_nodeColor-' + index).value;
            updateAll();
        };
        document.getElementById('style_linkColor-' + index).onchange = function () {
            linkColor ='#' + document.getElementById('style_linkColor-' + index).value;
            updateAll();
        };
        document.getElementById('style_linkOpacity-' + index).onchange = function () {
            linkOpacity = document.getElementById('style_linkOpacity-' + index).value;
            document.getElementById('style_linkOpacity-label-' + index).textContent = linkOpacity;
            updateAll();
        };
    } catch (e) {
        
    }
    //loading .json - file data_parsed_node-link
    d3.json("uploads/parsed/data_parsed_node-link.json", function(error, _graph) {
        if (error) throw error;
        graph = _graph;
        startDisplay();
        startSimulation();
    });



//defining variables
    var svg = d3.select('#visSVG-' + index)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .call(d3.zoom().on("zoom", function () { //zoom function
            svg.attr("transform", d3.event.transform)
        }))
        .append("g");

    var width = svgWidth,
        height = svgHeight,
        simulation = d3.forceSimulation(),
        graph,
        link,
        node;

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
            .style("stroke-width", 1.5)
            .style("stroke", linkColor)
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");
            //.style("opacity", 0.1);

        node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .attr("fill", nodeColor)
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
            .attr("stroke-width", 0.5)
            .attr("fill", nodeColor);

        link
            .style("stroke-width", 1.5)
            .style("stroke", linkColor)
            .attr("opacity", linkOpacity);
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
        document.getElementById('nodeName-' + index).textContent = d3.event.subject.id;
        document.getElementById('nodeX-' + index).textContent = d3.event.subject.x;
        document.getElementById('nodeY-' + index).textContent = d3.event.subject.y;
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

function drawAdjacencyMatrix(index) {

    var width_adj = svgWidth,
        height_adj = svgHeight;
    var x_adj = d3.scaleBand().range([0, width_adj]),
        z_adj = d3.scaleLinear().domain([0, 4]).clamp(true),
        c_adj = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(10));
    var svg_adj = d3.select('#visSVG-' + index)
        .attr("width", width_adj )
        .attr("height", height_adj)
        .append("g");

    d3.json("uploads/parsed/data_parsed_matrix.json", function(data) {
        var matrix_adj = [],
            nodes_adj = data.nodes,
            links_adj  =data.links,
            n = nodes_adj.length;
        // Compute index per node.
        nodes_adj.forEach(function(node, i) {
            node.index = i;
            node.count = 0;
            matrix_adj[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
        });

        /* Redundant Code [DO NOT REMOVE]
        console.log(data.nodes);
        console.log(data.links);

        matrix_adj = new Array(n).fill(0).map(() => new Array(n).fill(0));
        //Map values x = i, y = j.
        for(let j = 0; j < n; j++){
            for(let i = 0; i < n; i++){
                matrix_adj[i][j] = {x: j, y: i, z: 0};
            }
        }

        links_adj.forEach(function (link) {
            if(matrix_adj[link.source][link.target] != null){
                matrix_adj[link.source][link.target].z = link.value;
            }
        });

        console.log(matrix_adj);

        //Init Matrix
        matrix_adj = new Array(n).fill(0).map(() => new Array(n).fill(0));
        //Map values x = i, y = j.
        for(let j = 0; j < n; j++){
            for(let i = 0; i < n; i++){
                matrix_adj[i][j] = {x: j, y: i, z: 4};
            }
        }

 */

        // Convert links to matrix; count character occurrences.
        data.links.forEach(function(link) {
            if(matrix_adj[link.source][link.target] != null) {
                matrix_adj[link.source][link.target].z += link.value;
                matrix_adj[link.target][link.source].z += link.value;
                nodes_adj[link.source].count++;
                nodes_adj[link.target].count++;
            }
        });

        // Precompute the orders.
        var orders = {
            id: d3.range(n).sort(function(a, b) { return d3.ascending(nodes_adj[a].id, nodes_adj[b].id); }),
            count: d3.range(n).sort(function(a, b) { return nodes_adj[b].count - nodes_adj[a].count; })
        };
        // The default sort order.
        x_adj.domain(orders.id);
        svg_adj.append("rect")
            .attr("class", "background-matrix")
            .attr("width", width_adj)
            .attr("height", height_adj);
        var row = svg_adj.selectAll(".row")
            .data(matrix_adj)
            .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + x_adj(i) + ")"; })
            .each(row);
        //row.append("line")
        //    .attr("x2", width_adj);
        row.append("text")
            .attr("x", -6)
            .attr("y", x_adj.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .text(function(d, i) { return nodes_adj[i].id; });
        var column = svg_adj.selectAll(".column")
            .data(matrix_adj)
            .enter().append("g")
            .attr("class", "column")
            .attr("transform", function(d, i) { return "translate(" + x_adj(i) + ")rotate(-90)"; });
        //column.append("line")
        //    .attr("x1", -width_adj);
        column.append("text")
            .attr("x", 6)
            .attr("y", x_adj.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "start")
            .text(function(d, i) { return nodes_adj[i].id; });
        function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function(d) { return d.z; }))
                .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function(d) { return x_adj(d.x); })
                .attr("width", x_adj.bandwidth())
                .attr("height", x_adj.bandwidth())
                .style("fill-opacity", function(d) { return z_adj(d.z); })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
        }
        function mouseover(p) {
            d3.selectAll(".row text").classed("active", function(d, i) { return i === p.y; });
            d3.selectAll(".column text").classed("active", function(d, i) { return i === p.x; });
        }
        function mouseout() {
            d3.selectAll("text").classed("active", false);
        }
        d3.select("#order").on("change", function() {
            clearTimeout(timeout);
            order(this.value);
        });
        function order(value) {
            x_adj.domain(orders[value]);
            var t = svg_adj.transition().duration(2500);
            t.selectAll(".row")
                .delay(function(d, i) { return x_adj(i) * 4; })
                .attr("transform", function(d, i) { return "translate(0," + x_adj(i) + ")"; })
                .selectAll(".cell")
                .delay(function(d) { return x_adj(d.x) * 4; })
                .attr("x", function(d) { return x_adj(d.x); });
            t.selectAll(".column")
                .delay(function(d, i) { return x_adj(i) * 4; })
                .attr("transform", function(d, i) { return "translate(" + x_adj(i) + ")rotate(-90)"; });
        }
        var timeout = setTimeout(function() {
            order("count");
            d3.select("#order").property("selectedIndex", 2).node().focus();
        }, 5000);
    });
}