//Build menu bar
export function guiInit(nextIndex) {
    // Adding graph element to <div>
    $("#div-" + nextIndex).append(`
            <!-- Visualisation Card-->
        <div class="card text-center mb-3" id="card-${nextIndex}">
            <div class="card-header text-right">
                <div class="form-check-inline">
                    <label class="sr-only" for="visTypeSelect">Type</label>
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Type</div>
                        </div>
                        <select class="custom-select mr-sm-2" id="visTypeSelect-${nextIndex}">
                            <option value="1" selected disabled>None</option>
                            <option value="2">Node Link [Force]</option>
                            <option value="3">Adjacency Matrix</option>
                        </select>
                    </div>
               </div>
                <!-- Button that triggers visualisation -->
                <button class="btn btn-primary disabled" id="visGraph-${nextIndex}">
                    Visualize
                </button>
                <a class="btn btn-primary disabled" id="settingsBtn-${nextIndex}" data-toggle="collapse" href="#settings-${nextIndex}" role="button" aria-expanded="false" aria-controls="settings-${nextIndex}">
                    <i class="fas fa-wrench"></i>
                </a>
                <a class="btn btn-primary disabled" id="infoBtn-${nextIndex}" data-toggle="collapse" href="#info-${nextIndex}" role="button" aria-expanded="false" aria-controls="info-${nextIndex}">
                    <i class="fas fa-info"></i>
                </a>
                <a class="btn btn-primary disabled" id="visBtn-${nextIndex}" data-toggle="collapse" href="#visualisation-${nextIndex}" role="button" aria-expanded="false" aria-controls="visualisation-${nextIndex}">
                    <i class="fas fa-expand"></i>
                </a>
            </div>
        </div>
            `);
}


// Add relevant settings for selected graph
export function guiOptionInit(nextIndex, type) {
    switch(parseInt(type)){
        case 2 :
            $("#card-" + nextIndex).append(`
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
            </div>`);
            break;
        case 3 :
            $("#card-" + nextIndex).append(`
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
                                        Ordering
                                    </div>
                                    <div class="card-body">
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Type</div>
                                            </div>
                                            <select class="custom-select mr-sm-2" id="visTypeSelect-${nextIndex}">
                                                <option value="1" selected disabled>Random</option>
                                                <option value="2">Alphabetical</option>
                                                <option value="3">Value</option>
                                                <option value="3">Group</option>
                                            </select>
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
            </div>`);
            break;

    }
    return Promise.resolve();
}