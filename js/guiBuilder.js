//Build menu bar
export function guiInit(index) {
    // Adding graph element to <div>
    $("#div-" + index).append(`
            <!-- Visualisation Card-->
        <div class="card text-center mb-3" id="card-${index}">
            <div class="card-header text-right">
                <div class="form-check-inline">
                    <label class="sr-only" for="visTypeSelect-${index}">Type</label>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Type</div>
                        </div>
                        <select class="custom-select mr-sm-2" id="visTypeSelect-${index}">
                            <option value="1" selected disabled>None</option>
                            <option value="2">Node Link [Force]</option>
                            <option value="3">Node Link [Radial]</option>
                            <option value="4">Adjacency Matrix</option>
                            <option value="5">Arc Diagram</option>
                        </select>
                    </div>
               </div>
                <!-- Button that triggers visualisation -->
                <button class="btn btn-primary disabled" id="visGraph-${index}">
                    Visualize
                </button>
                <a class="btn btn-primary disabled" id="settingsBtn-${index}" data-toggle="collapse" href="#settings-${index}" role="button" aria-expanded="false" aria-controls="settings-${index}">
                    <i class="fas fa-wrench"></i>
                </a>
                <a class="btn btn-primary disabled" id="infoBtn-${index}" data-toggle="collapse" href="#info-${index}" role="button" aria-expanded="false" aria-controls="info-${index}">
                    <i class="fas fa-info"></i>
                </a>
                <a class="btn btn-primary disabled" id="visBtn-${index}" data-toggle="collapse" href="#visualisation-${index}" role="button" aria-expanded="false" aria-controls="visualisation-${index}">
                    <i class="fas fa-expand"></i>
                </a>
            </div>
        </div>
            `);
}


// Add relevant settings for selected graph
export function guiOptionInit(index, type) {
    switch(parseInt(type)){
        case 2 :
            // noinspection JSJQueryEfficiency
            $("#card-" + index).append(`
            <div class="collapse" id="settings-${index}">
                <div class="card-body">
                    <form>
                        <div class="form-row">
                            <div class="col-sm">
                                <div class="card">
                                    <div class="card-header">
                                        Dimensions
                                    </div>
                                    <div class="card-body">
                                        <label class="sr-only" for="width-form-${index}">Width</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Width</div>
                                            </div>
                                            <input type="text" class="form-control" id="width-form-${index}" placeholder="px" value="1000">
                                        </div>
                                        <label class="sr-only" for="height-form-${index}">Height</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Height</div>
                                            </div>
                                            <input type="text" class="form-control" id="height-form-${index}" placeholder="px" value="1000">
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
                                            <div class="input-group-text col-md-8 mb-2">X :\t&nbsp;<div id="X-label-${index}">0.5</div></div>
                                            <input type="range" class="custom-range" id="center_X-${index}" min="0" max="1" value=".5" step="0.01">
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group-text col-md-8 mb-2">Y :\t&nbsp;<div id="Y-label-${index}">0.5</div></div>
                                            <input type="range" class="custom-range" id="center_Y-${index}" min="0" max="1" value=".5" step="0.01">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Charge
                                        <div class="custom-control custom-checkbox float-right">
                                            <input type="checkbox" class="custom-control-input" id="chargeCheck-${index}" checked>
                                            <label class="custom-control-label" for="chargeCheck-${index}"></label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Strength :\t&nbsp;<div id="Strength-label-${index}">-50</div></div>
                                            <input type="range" class="custom-range" id="charge_Strength-${index}" min="-200" max="10" value="-50" step=".1">
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Max Distance :\t&nbsp;<div id="distanceMax-label-${index}">5000</div></div>
                                            <input type="range" class="custom-range" id="charge_distanceMax-${index}" min="0" max="5000" value="5000" step=".1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Link
                                        <div class="custom-control custom-checkbox float-right">
                                            <input type="checkbox" class="custom-control-input" id="linkCheck-${index}" checked>
                                            <label class="custom-control-label" for="linkCheck-${index}"></label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Distance :\t&nbsp;<div id="Distance-label-${index}">30</div></div>
                                            <input type="range" class="custom-range" id="link_Distance-${index}" min="0" max="100" value="30" step="1">
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
                                            <input type="checkbox" class="custom-control-input" id="collideCheck-${index}" checked>
                                            <label class="custom-control-label" for="collideCheck-${index}">Collide</label>
                                        </div>
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="clusteringCheck-${index}" checked>
                                            <label class="custom-control-label" for="clusteringCheck-${index}">Clustering&nbsp;&nbsp;<i class="fas fa-exclamation-triangle"></i></label>
                                        </div>
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="clusterZoom-${index}">
                                            <label class="custom-control-label" for="clusterZoom-${index}">Cluster Zooming</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Styling
                                        <div class="custom-control custom-checkbox float-right">
                                            <input type="checkbox" class="custom-control-input" id="styleCheck-${index}">
                                            <label class="custom-control-label" for="styleCheck-${index}"></label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <h6 class="card-title text-left">Nodes</h6>
                                        <hr>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Color</div>
                                            </div>
                                            <input type="text" class="jscolor form-control" id="style_nodeColor-${index}" placeholder="#" value="007bff">
                                        </div>
                                        <h6 class="card-title text-left">Links</h6>
                                        <hr>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Color</div>
                                            </div>
                                            <input type="text" class="jscolor form-control" id="style_linkColor-${index}" placeholder="#" value="D0D0D0">
                                        </div>
                                        <div class="form-group">
                                            <div class="input-group-text mb-2">Opacity :&nbsp;<div id="style_linkOpacity-label-${index}">0.5</div></div>
                                            <input type="range" class="custom-range" id="style_linkOpacity-${index}" min="0" max="1" value=".5" step="0.01" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="collapse" id="info-${index}">
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
                                    <div class="form-control" id="nodeName-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <label class="sr-only" for="childrenList-${index}">Children</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Children</div>
                                    </div>
                                    <select class="custom-select mr-sm-2" id="childrenList-${index}">
                                   
                                    </select>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">X :</div>
                                    </div>
                                    <div class="form-control" id="nodeX-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Y :</div>
                                    </div>
                                    <div class="form-control" id="nodeY-${index}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="collapse" id="visualisation-${index}">
                <div class="card-body" id="vis-body-${index}">
                    <svg id="vis-${index}"></svg>
                </div>
            </div>`);
            break;
        case 3 :
            // noinspection JSJQueryEfficiency
            $("#card-" + index).append(`
            <div class="collapse" id="settings-${index}">
                <div class="card-body">
                    
                </div>
            </div>
            <div class="collapse" id="info-${index}">
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
                                    <div class="form-control" id="nodeName-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">X :</div>
                                    </div>
                                    <div class="form-control" id="nodeX-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Y :</div>
                                    </div>
                                    <div class="form-control" id="nodeY-${index}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="collapse" id="visualisation-${index}">
                <div class="card-body maxwidth" id="vis-body-${index}">
                    <div id="vis-${index}"></div>
                </div>
            </div>`);
            break;
        case 4 :
            // noinspection JSJQueryEfficiency
            $("#card-" + index).append(`
            <div class="collapse" id="settings-${index}">
                <div class="card-body">
                    <form>
                        <div class="form-row">
                            <div class="col-sm">
                                <div class="card">
                                    <div class="card-header">
                                        Dimensions
                                    </div>
                                    <div class="card-body">
                                        <label class="sr-only" for="width-form-${index}">Width</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Width</div>
                                            </div>
                                            <input type="text" class="form-control" id="width-form-${index}" placeholder="px" value="1000">
                                        </div>
                                        <label class="sr-only" for="height-form-${index}">Height</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Height</div>
                                            </div>
                                            <input type="text" class="form-control" id="height-form-${index}" placeholder="px" value="1000" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Ordering
                                    </div>
                                    <div class="card-body">
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Type</div>
                                            </div>
                                            <select class="custom-select mr-sm-2" id="ordering-${index}">
                                                <option value="id" selected>Alphabetical</option>
                                                <option value="nameReverse">Alphabetical (Reversed)</option>
                                                <option value="count">by Connections</option>
                                                <option value="countReverse">by Connections (Reversed)</option>
                                                <option value="group">by Cluster</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm">
                                <div class="card mb-2">
                                    <div class="card-header">
                                        Styling
                                    </div>
                                    <div class="card-body">
                                        <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="lineCheck-${index}">
                                            <label class="custom-control-label" for="lineCheck-${index}">Lines</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="collapse" id="info-${index}">
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
                                    <div class="form-control" id="nodeName-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">X :</div>
                                    </div>
                                    <div class="form-control" id="nodeX-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Y :</div>
                                    </div>
                                    <div class="form-control" id="nodeY-${index}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="collapse" id="visualisation-${index}">
                <div class="card-body scroll" id="vis-body-${index}">
                    <svg id="vis-${index}"></svg>
                </div>
            </div>`);
            break;
        case 5:
            // noinspection JSJQueryEfficiency
            $("#card-" + index).append(`
            <div class="collapse" id="settings-${index}">
                <div class="card-body">
                    
                </div>
            </div>
            <div class="collapse" id="info-${index}">
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
                                    <div class="form-control" id="nodeName-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">X :</div>
                                    </div>
                                    <div class="form-control" id="nodeX-${index}"></div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Y :</div>
                                    </div>
                                    <div class="form-control" id="nodeY-${index}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="collapse" id="visualisation-${index}">
                <div class="card-body scroll" id="vis-body-${index}">
                    <div id="vis-${index}"></div>
                </div>
            </div>`);
            break;

    }
    return Promise.resolve();
}