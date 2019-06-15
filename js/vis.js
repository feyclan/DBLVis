// Import functions from other .js files, needed to build the GUI.
import {rebuildColorPicker} from './jscolor.js';
import {guiInit, guiOptionInit} from './guiBuilder.js';
import {clusterNodeGraph, prepareCluster} from "./cluster.js";

// Global standard value init.

//Array [standard val, value for graph 1, value for graph 2, ...]
var svgWidth = [],
    svgHeight = [],
    // Graph types that are not yet selected are 1, otherwise 0. [None, Node Link force, Node Link Radial, Adjacency Matrix]
    typeAvailable = [0, 1, 1, 1],
    lines = false,
    styling = false,
    nodeColor = '#007bff',
    linkColor = '#D0D0D0',
    linkOpacity = 0.5,
    clusterActive = true;

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
    addMenuBar();
});

//Add new menu bar
function addMenuBar(){
    // Finding total number of elements added
    var total_element = $(".element").length;

    // last <div> with element class id
    // noinspection JSJQueryEfficiency
    var lastid = $(".element:last").attr("id");
    var split_id = lastid.split("-");
    var index = Number(split_id[1]) + 1;
    //Set maximum number of elements
    var max = 5;
    // Check total number elements
    if(total_element < max ){
        // Adding new div container after last occurance of element class
        $(".element:last").after("<div class='element' id='div-"+ index +"'></div>");
        //Build GUI
        guiInit(index);
        //Disable graphs which are already selected.
        for(let i = 0; i < typeAvailable.length; i++) {
            if(typeAvailable[i] === 0) {
                document.getElementById('visTypeSelect-' + index).options[i].disabled = true;
            }
        }
        //Disable options as to not create unexpected behaviour of site.
        document.getElementById('visTypeSelect-' + index).addEventListener('change', function () {
            document.getElementById('visGraph-' + index).classList.remove("disabled");
            document.getElementById('settingsBtn-' + index).classList.remove("disabled");
            document.getElementById('visTypeSelect-' + index).disabled = true;
            //Get value of activated graph. Set array accordingly.
            var sel = document.getElementById('visTypeSelect-' + index),
                type = sel.options[sel.selectedIndex].value;
            typeAvailable[type-1] = 0;

            //Set standard values for graphs
            svgWidth[index] = 1000; svgHeight[index] = 1000;

            guiOptionInit(index, type).then(function (){
                interactiveGraph(index, type);
                rebuildColorPicker();
            });

        });

    }
}

//Function that adds appropriate event listeners for interactivity.
function interactiveGraph(index, type){
    //Event Listener to draw graph
    document.getElementById('visGraph-' + index).addEventListener('click', function () {
        document.getElementById('infoBtn-' + index).classList.remove("disabled");
        document.getElementById('visBtn-' + index).classList.remove("disabled");
        $('#visSVG-' + index).empty();
        typeSelector(index, type);
    });
    //Event Listeners for changing graph dimensions
    document.getElementById('width-form-' + index).addEventListener('input', function () {
        svgWidth[index] = parseInt(document.getElementById('width-form-' + index).value);
        $('#visSVG-' + index).empty();
        typeSelector(index, type);
    });
    //Event Listeners for changing graph dimensions
    document.getElementById('height-form-' + index).addEventListener('input', function () {
        svgHeight[index] = parseInt(document.getElementById('height-form-' + index).value);
        $('#visSVG-' + index).empty();
        typeSelector(index, type);
    });
}

//Select appropriate graph for global settings
function typeSelector(index, type) {
    switch(parseInt(type)){
        case 2 :
            drawNodeLinkForce(index);
        break;
        case 3 :
            drawNodeLinkRadial(index);
            break;
        case 4 :
            drawAdjacencyMatrix(index);
        break;
    }
}

function drawNodeLinkForce(index) {
    //defining variables
    var svg = d3.select('#visSVG-' + index)
        .attr("width", svgWidth[index])
        .attr("height", svgWidth[index])
        .call(d3.zoom().on("zoom", function () { //zoom function
            svg.attr("transform", d3.event.transform)
        }))
        .append("g");

    var width = svgWidth[index],
        height = svgWidth[index],
        simulation = d3.forceSimulation(),
        graph,
        graphOrigin,
        link,
        node;

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
        document.getElementById('styleCheck-' + index).onchange = function () {
            $('#style_linkOpacity-'+ index).prop("disabled", (_, val) => !val);
            // Assign standard variables when checkbox is not checked.
            styling = !!$('#styleCheck-' + index + ':checked').val();
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
        document.getElementById('clusteringCheck-' + index).onchange = function () {
            clusterActive = !clusterActive;
            reloadJSON();
            startDisplay();
            startSimulation();
            //updateAll();
        };
        document.getElementById('style_nodeColor-' + index).onchange = function () {
            nodeColor ='#' + document.getElementById('style_nodeColor-' + index).value;

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
        graphOrigin = _graph;
        if(clusterActive){
            clusterNodeGraph(_graph, false).then(function (data) {
                graph = data;
                startDisplay();
                startSimulation();
            });
        }else{
            graph = _graph;
            startDisplay();
            startSimulation();
        }
    });

    function reloadJSON(){
        d3.json("uploads/parsed/data_parsed_node-link.json", function(error, _graph) {
            if (error) throw error;
            graphOrigin = _graph;
            if(clusterActive){
                clusterNodeGraph(_graph, false).then(function (data) {
                    graph = data;
                    startDisplay();
                    startSimulation();
                });
            }else{
                graph = _graph;
                startDisplay();
                startSimulation();
            }
        });
    }


    function startSimulation() {

        simulation.nodes(graph.nodes);
        startForce();
        simulation.on("tick", update);
        /* [OPTIONAL] Reduce renders per tick, above line should be commented out when using this.
        var ticksPerRender = 3;
        requestAnimationFrame(function render() {
            for (var i = 0; i < ticksPerRender; i++) {
                simulation.tick();
            }
            update();

            if (simulation.alpha() > 0) {
                requestAnimationFrame(render);
            }
        })

         */
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
            .radius(function(d) { if(d.count){return d.count * 4 + 10;}else{return forceProperties.collide.radius}});
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
            .enter().append("line")
            .attr("opacity", 0.5);

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
                .on("drag", dragging))
                //[REDUNDANT].on("dblclick",function(d){ alert("node was double clicked"); })
                .on("contextmenu", function (d, i) { // d = object (node), i = index
                    // Remove standard browser menu
                    d3.event.preventDefault();
                    // React on right-clicking
                    prepareCluster(d, graphOrigin, graph).then(function (result) {
                        graph = result;
                        /* [DEBUG]
                        console.log(d);
                        console.log(graph);
                         */
                        startDisplay();
                        startSimulation();
                    });
                });

        updateDisplay();
    }

    function updateDisplay() {
        node
            .attr("r", function(d) { if(d.count){if(d.count*4>200){return 200}else{return d.count * 4;}}else{return forceProperties.collide.radius}});
            if(styling === true){
            node
                .attr("stroke-width", 0.5)
                .attr("fill", nodeColor);
            }

        link //Stopped working inside if statement?
            .style("stroke", linkColor)
            .style("stroke-width", function(d) { let val = d.value * 2; if(val > 100){return 100}else{return val}});
            if(styling === true){
            link
                .attr("opacity", linkOpacity);
            }

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

    function startedTheDragging() {
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

function drawNodeLinkRadial(index){
    var nodesRadius = 2,
        linksColor = "Red" ,
        nodesColor = "Blue",
        lineWidth = 0.8,
        lineTransparency = 0.3,
        nodeTransparency = 1.0, //keep this at 1.0!
        radiusOfRadial = 500,
        transform = d3.zoomIdentity,
        simulation = d3.forceSimulation();

    var canvas = d3.select('#visCanvas-' + index)
        .append("canvas")
        .attr('width', svgWidth[index])
        .attr('height', svgWidth[index])
        .node();
    //input
    d3.json('uploads/parsed/data_parsed_node-link.json', function (error, graph) {
        if (error) throw error;

        simulation.force("link", d3.forceLink()
            .strength(0)
            .id(function(d) { return d.id; }))
            .force("charge", d3.forceCollide()
                .radius(10))
            .force("r", d3.forceRadial(function() { return radiusOfRadial;}));
        var ctx = canvas.getContext('2d');
        //add zoomfunction to visualization
        d3.select(canvas)
            .call(d3.zoom()
                .scaleExtent([1 / 1000, 10])
                .on("zoom", zoom));
        simulation.nodes(graph.nodes)
            .on('tick', tick);

        simulation.force('link')
            .links(graph.links);

        //zoomfunction
        function zoom() {
            transform = d3.event.transform;
            tick();}
        function tick() {
            ctx.save();

            ctx.clearRect(0, 0, svgWidth[index], svgHeight[index]);
            ctx.translate(transform.x, transform.y);
            ctx.scale(transform.k, transform.k);
            ctx.beginPath();
            graph.links.forEach(function (d) {
                //width of edge
                ctx.lineWidth = lineWidth;
                //color of edge
                ctx.strokeStyle = linksColor;
                //tranparency of whole graph!!
                ctx.globalAlpha = lineTransparency;
                ctx.moveTo(d.source.x, d.source.y);
                ctx.lineTo(d.target.x, d.target.y); });
            ctx.stroke();
            graph.nodes.forEach(function (d) {
                //color of nodes
                ctx.fillStyle = nodesColor;
                //transparency of nodes
                ctx.globalAlpha = nodeTransparency;

                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.arc(d.x, d.y, nodesRadius, 0, 2 * Math.PI);
                ctx.fill();});
            ctx.restore();}

    });
}

function drawAdjacencyMatrix(index) {
    var margin = {top: 100, right: 0, bottom: 10, left: 100};
    var width_adj = svgWidth[index],
        height_adj = svgHeight[index],
        matrix_adj = [],
        nodes_adj, links_adj, n;
    var x_adj = d3.scaleBand().range([0, width_adj]),
        z_adj = d3.scaleLinear().domain([0, 4]).clamp(true);
        //c_adj = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(10));
    var svg_adj = d3.select('#visSVG-' + index)
        .attr("width", (width_adj + margin.left + margin.right))
        .attr("height", (height_adj + margin.top + margin.bottom))
        //.style("margin-right", -margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function loadJSON() {
        return new Promise(function (resolve) {
            d3.json("uploads/parsed/data_parsed_matrix.json", function(data) {
                resolve(data);
            });
        });
    }

    //Redundant for the moment -does nothing-
    function clusterLouvain(data) {
//        var nodeArr = [];
/*
        data.nodes.forEach(function (e) {
           nodeArr.push(e.indexOf());
        });


        for(let i = 0; i < data.nodes.length; i++){
            nodeArr.push(i);
        }

 */

        //console.log(nodeArr);
        //console.log(data.links);
        //var community = jLouvain().nodes(nodeArr).edges(data.links);
        //console.log(community());
        return data;
    }

    loadJSON().then(function (data) {
        return new Promise(function (resolve) {
           resolve(clusterLouvain(data));
        });
    }).then(function(data) {
        matrix_adj = [];
        nodes_adj = data.nodes;
        links_adj = data.links;
        n = nodes_adj.length;


        // Compute index per node.
        nodes_adj.forEach(function(node, i) {
            node.index = i;
            node.count = 0;
            //matrix_adj[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
        });

        //Add listeners
        document.getElementById('lineCheck-' + index).onchange = function () {
            // Assign standard variables when checkbox is not checked.
            if($('#lineCheck-'+ index +':checked').val()){
                lines = true;
                drawMatrix();
            } else {
                lines = false;
                drawMatrix();
            }
        };

        //Initialize matrix
        matrix_adj = new Array(n).fill(0).map(() => new Array(n).fill(0));
        //Map values x = i, y = j.
        for(let j = 0; j < n; j++){
            for(let i = 0; i < n; i++){
                matrix_adj[i][j] = {x: j, y: i, z: 0};
            }
        }

        // Convert links to matrix; count character occurrences.
        links_adj.forEach(function(link) {
            if(matrix_adj[link.source][link.target] != null) {
                matrix_adj[link.source][link.target].z += link.value;
                matrix_adj[link.target][link.source].z += link.value;
                nodes_adj[link.source].count++;
                nodes_adj[link.target].count++;
            }
        });

        /* Redundant Code [DO NOT REMOVE]
        console.log(data.nodes);
        console.log(data.links);


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

        // Precompute the orders.
        var orders = {
            id: d3.range(n).sort(function(a, b) { return d3.ascending(nodes_adj[a].id, nodes_adj[b].id); }),
            count: d3.range(n).sort(function(a, b) { return nodes_adj[b].count - nodes_adj[a].count; })
        };

        // The default sort order.
        x_adj.domain(orders.id);
        drawMatrix();

        function mouseover(p) {
            d3.selectAll(".row text").classed("active", function(d, i) { return i === p.y; });
            d3.selectAll(".column text").classed("active", function(d, i) { return i === p.x; });
            d3.selectAll(".cell").classed("active", function(d, i) { return i === p.x; });
        }

        function mouseout() {
            d3.selectAll("text").classed("active", false);
            d3.selectAll(".cell").classed("active", false);
        }

        d3.select("#visTypeSelect").on("change", function() {
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
        /*
        var timeout = setTimeout(function() {
            order("count");
            d3.select("#visTypeSelect").property("selectedIndex", 1).node().focus();
        }, 5000);
         */
        function drawMatrix(){
            svg_adj.selectAll("*").remove();
            svg_adj.append("rect")
                .attr("class", "background-matrix")
                .attr("width", width_adj)
                .attr("height", height_adj);
            // noinspection JSDuplicatedDeclaration
            var row = svg_adj.selectAll(".row")
                .data(matrix_adj)
                .enter().append("g")
                .attr("class", "row")
                .attr("transform", function(d, i) { return "translate(0," + x_adj(i) + ")"; })
                .each(row);
            row.append("text")
                .style("font-size", calcFont(height_adj))
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
            column.append("text")
                .style("font-size", calcFont(width_adj))
                .attr("x", 6)
                .attr("y", x_adj.bandwidth() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "start")
                .text(function(d, i) { return nodes_adj[i].id; });
            // noinspection JSDuplicatedDeclaration
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
            if(lines){
                row.append("line")
                    .attr("x2", width_adj);
                column.append("line")
                    .attr("x1", -width_adj);
            }
        }
        //Calculate font size of node titles dependent of Matrix size.
        function calcFont(size) {
            return (size/1200).toString() + 'px';
        }
    });
}