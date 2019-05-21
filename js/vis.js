import { rebuildColorPicker } from './jscolor.js';

// Global standard value init.
var svgWidth = 1000;
var svgHeight = 1000;
var nodeColor = '#007bff';
var linkColor = '#D0D0D0';
var linkOpacity = 0.5;

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
    var index = addGraph();
    interactiveGraph(index);
    rebuildColorPicker();
});

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

            // Adding element to <div>
            $("#div-" + nextIndex).append(`
            <!-- Visualisation Card-->
        <div class="card text-center mb-3">
            <div class="card-header text-right">
                <div class="form-check-inline">
                    <label class="sr-only" for="typeSelect">Type</label>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Type</div>
                        </div>
                        <select class="custom-select mr-sm-2" id="typeSelect">
                            <option value="1" selected>Node Link [Force]</option>
                            <option value="2">Adjacency Matrix</option>
                        </select>
                    </div>
               </div>
                <!-- Button that triggers visualisation -->
                <button class="btn btn-primary" id="visGraph-${nextIndex}">
                    Visualize
                </button>
                <a class="btn btn-primary disabled" id="settingsBtn-${nextIndex}" data-toggle="collapse" href="#settings-${nextIndex}" role="button" aria-expanded="false" aria-controls="settings-${nextIndex}">
                    <i class="fas fa-wrench"></i>
                </a>
                <a class="btn btn-primary disabled" id="infoBtn-${nextIndex}" data-toggle="collapse" href="#info-${nextIndex}" role="button" aria-expanded="false" aria-controls="info-${nextIndex}">
                    <i class="fas fa-info"></i>
                </a>
                <a class="btn btn-primary" id="visBtn-${nextIndex}" data-toggle="collapse" href="#visualisation-${nextIndex}" role="button" aria-expanded="false" aria-controls="visualisation-${nextIndex}">
                    <i class="fas fa-expand"></i>
                </a>
            </div>
            <div class="collapse" id="settings-${nextIndex}">
                <div class="card-body">
                    <form>
                        <div class="form-row">
                            <div class="col-sm">
                                <div class="card">
                                    <div class="card-header">
                                        Dimensions
                                    </div>
                                    <div class="card-body">
                                        <label class="sr-only" for="width-form-${nextIndex}">Width</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Width</div>
                                            </div>
                                            <input type="text" class="form-control" id="width-form-${nextIndex}" placeholder="px" value="1000">
                                        </div>
                                        <label class="sr-only" for="height-form-${nextIndex}">Height</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Height</div>
                                            </div>
                                            <input type="text" class="form-control" id="height-form-${nextIndex}" placeholder="px" value="1000">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Center
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <div class="input-group-text col-md-8 mb-2">X :\t&nbsp;<div id="X-label-${nextIndex}">0.5</div></div>
                                            <input type="range" class="custom-range" id="center_X-${nextIndex}" min="0" max="1" value=".5" step="0.01">
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group-text col-md-8 mb-2">Y :\t&nbsp;<div id="Y-label-${nextIndex}">0.5</div></div>
                                            <input type="range" class="custom-range" id="center_Y-${nextIndex}" min="0" max="1" value=".5" step="0.01">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Charge
                                        <div class="custom-control custom-checkbox float-right">
                                            <input type="checkbox" class="custom-control-input" id="chargeCheck-${nextIndex}" checked>
                                            <label class="custom-control-label" for="chargeCheck-${nextIndex}"></label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Strength :\t&nbsp;<div id="Strength-label-${nextIndex}">-50</div></div>
                                            <input type="range" class="custom-range" id="charge_Strength-${nextIndex}" min="-200" max="10" value="-50" step=".1">
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Max Distance :\t&nbsp;<div id="distanceMax-label-${nextIndex}">2000</div></div>
                                            <input type="range" class="custom-range" id="charge_distanceMax-${nextIndex}" min="0" max="2000" value="2000" step=".1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Link
                                        <div class="custom-control custom-checkbox float-right">
                                            <input type="checkbox" class="custom-control-input" id="linkCheck-${nextIndex}" checked>
                                            <label class="custom-control-label" for="linkCheck-${nextIndex}"></label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Distance :\t&nbsp;<div id="Distance-label-${nextIndex}">30</div></div>
                                            <input type="range" class="custom-range" id="link_Distance-${nextIndex}" min="0" max="100" value="30" step="1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        General
                                    </div>
                                    <div class="card-body">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="collideCheck-${nextIndex}" checked>
                                            <label class="custom-control-label" for="collideCheck-${nextIndex}">Collide</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Styling
                                    </div>
                                    <div class="card-body">
                                        <h6 class="card-title text-left">Nodes</h6>
                                        <hr>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Color</div>
                                            </div>
                                            <input type="text" class="jscolor form-control" id="style_nodeColor-${nextIndex}" placeholder="#" value="007bff">
                                        </div>
                                        <h6 class="card-title text-left">Links</h6>
                                        <hr>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Color</div>
                                            </div>
                                            <input type="text" class="jscolor form-control" id="style_linkColor-${nextIndex}" placeholder="#" value="D0D0D0">
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Opacity :&nbsp;<div id="style_linkOpacity-label-${nextIndex}">0.5</div></div>
                                            <input type="range" class="custom-range" id="style_linkOpacity-${nextIndex}" min="0" max="1" value=".5" step="0.01">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="collapse" id="info-${nextIndex}">
                <div class="card text-left">
                    <div class="card-body">
                        <h6 class="card-title">Node Information</h6>
                        <hr>
                        <div class="form-row align-items-center">
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Name :</div>
                                    </div>
                                    <div class="form-control" id="nodeName-${nextIndex}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">X :</div>
                                    </div>
                                    <div class="form-control" id="nodeX-${nextIndex}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Y :</div>
                                    </div>
                                    <div class="form-control" id="nodeY-${nextIndex}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="collapse" id="visualisation-${nextIndex}">
                <div class="card-body">
                    <svg id="visSVG-${nextIndex}"></svg>
                </div>
            </div>
        </div>
            `);

        }

    // Remove element
    $('.container').on('click','.remove',function(){

        var id = this.id;
        var split_id = id.split("_");
        var deleteindex = split_id[1];

        // Remove <div> with id
        $("#div_" + deleteindex).remove();

    });
        return nextIndex;
}


function interactiveGraph(index){
    //Event Listener to draw graph
    document.getElementById('visGraph-' + index).addEventListener('click', function () {
        document.getElementById('settingsBtn-' + index).classList.remove("disabled");
        document.getElementById('infoBtn-' + index).classList.remove("disabled");
        $('#visSVG-' + index).empty();
        drawNodeLinkGraph(index);
    });
    //Event Listeners for changing svg dimensions
    document.getElementById('width-form-' + index).addEventListener('input', function () {
        svgWidth = document.getElementById('width-form-' + index).value;
        $('#visSVG-' + index).empty();
        drawNodeLinkGraph(index);
    });
    //Event Listeners for changing svg dimensions
    document.getElementById('height-form-' + index).addEventListener('input', function () {
        svgHeight = document.getElementById('height-form-' + index).value;
        $('#visSVG-' + index).empty();
        drawNodeLinkGraph(index);
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
    d3.json("uploads/parsed/miserables.json", function(error, _graph) {
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