<?php
// Start the session, needed for php to store variables.
session_start();
?>

<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <!-- Font Awesome (Used for Icons) -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <!-- CSS for sidebar and site -->
    <link rel="stylesheet" href="css/style.css">
    <title>Visualisation Studio</title>
</head>
<body>
    <div class="wrapper">
        <!-- Sidebar -->
        <nav id="sidebar" class="active">
            <div class="sidebar-header">
                <h3>Visualisation Studio</h3>
                <strong>VS</strong>
            </div>
            <ul class="list-unstyled">
                <li><a href="index.php"><i class="fas fa-home"></i><div>Home</div></a></li>
                <li><a href="vis.php"><i class="fas fa-chart-bar"></i><div>Visualisations</div></a></li>
                <!-- Button for navigation bar collapse (redundant) <li id="sidebarCollapse"><a><i class="fas fa-bars"></i></a></li>-->
            </ul>
        </nav>

        <!-- Content of page -->
        <div id="content">
            <!-- Upload Card -->
            <div class="card text-center mb-3">
                <div class="card-body">
                    <h5 class="card-title">Welcome to Visualisation Studio</h5>
                    <p class="card-text">Upload your .cvs file and visualise your data!</p>
                    <!-- Form for file upload -->
                    <form class="col-sm-4 mx-auto" action="php/upload.php" method="POST" enctype="multipart/form-data">
                        <div class="custom-file mb-3">
                            <input type="file" class="custom-file-input" id="uploadBtn" name="file">
                            <label class="custom-file-label" for="uploadBtn" id="fileLabel">Choose file</label>
                        </div>
                        <button type="submit" class="btn btn-info" name="submit" id="submit">Submit</button>
                    </form>
                </div>
            </div>
            <!-- Success and error messages that show after upload -->
            <div class="alert alert-success col-sm-3" role="alert" id="uploadMsgSuccess">
                <?php echo $_SESSION['uploadMsg']; ?>
            </div>
            <div class="alert alert-warning col-sm-3" role="alert" id="uploadMsgFail">
                <?php echo $_SESSION['uploadMsg']; ?>
            </div>
            <!-- Parser Card -->
            <div class="card mb-3">
                <div class="card-header text-center">File Parser</div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-2">
                            <div class="card text-center border-0">
                                <!-- Parse button -->
                                <div class="card-body">
                                    <button class="btn btn-info" id="parserBtn">Parse</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-10">
                            <div class="card">
                                <!-- Parser Settings -->
                                <div class="card-body">
                                    <p class="card-text">Parser settings &nbsp;&nbsp;<i class="fas fa-question-circle" id="parserSetInfo" data-toggle="modal" data-target="#parserModal"></i></p>
                                    <hr>
                                    <div class="form-check-inline">
                                        <label class="sr-only" for="typeSelect">Type</label>
                                        <div class="input-group mb-2">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">Type</div>
                                            </div>
                                            <select class="custom-select mr-sm-2" id="typeSelect">
                                                <option value="1" selected>All</option>
                                                <option value="2">Node Link</option>
                                                <option value="3">Adjacency Matrix</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="" id="header" checked>
                                        <label class="form-check-label" for="header">
                                            Header
                                        </label>
                                    </div>
                                    <div class="form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="" id="dynamicTyping" checked>
                                        <label class="form-check-label" for="dynamicTyping">
                                            Dynamic Typing
                                        </label>
                                    </div>
                                    <div class="form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="" id="worker" checked>
                                        <label class="form-check-label" for="worker">
                                            Worker
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Progress bar for parser -->
                    <div class="card-body" id="progressBar">
                        <hr>
                        <div class="progress">
                            <div class="progress-bar bg-info" role="progressbar" id="progress"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Success and error messages that show after parser has finished -->
            <div class="alert alert-success col-sm-3" role="alert" id="parserMsgSuccess">
                <p>Parsed File successfully.</p>
            </div>
            <div class="alert alert-warning col-sm-3" role="alert" id="parserMsgFail">
                <p>File failed to parse</p>
            </div>
        </div>
    </div>

    <!-- Modal for information about parser -->
    <div class="modal fade" id="parserModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Parser setting information</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <dl class="row">
                        <dt class="col-sm-3">Type</dt>
                        <dd class="col-sm-9">
                            Select type of parse for visualisations, when all is selected the data is parsed for every
                            type of data visualisation (slower).
                        </dd>
                        <dt class="col-sm-3">Header</dt>
                        <dd class="col-sm-9">
                            If true, the first row of parsed data will be interpreted as field names.
                        </dd>

                        <dt class="col-sm-3">Dynamic Typing</dt>
                        <dd class="col-sm-9">
                            If true, numeric and boolean data will be converted to their type instead of remaining strings.
                            Numeric data must conform to the definition of a decimal literal.
                        </dd>

                        <dt class="col-sm-3">Worker</dt>
                        <dd class="col-sm-9">
                            Whether or not to use a worker thread.
                            Using a worker will keep your page reactive, but may be slightly slower.
                        </dd>
                    </dl>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

    <!-- Script containing parser -->
    <script src="js/papaparse.min.js"></script>
    <script src="js/parser.js"></script>

    <!-- Script to check if info message should be shown and to set file name in text box -->
    <script>
            if("<?php echo $_SESSION['uploadMsg']; ?>" === "File uploaded"){
                document.getElementById('uploadMsgSuccess').style.display = "block";
            } else if(<?php if($_SESSION['uploadISSET']){echo $_SESSION['uploadISSET'];}else{echo "0";} ?>) {
                document.getElementById('uploadMsgFail').style.display = "block";
            }

            document.getElementById('uploadBtn').onchange = function(){
                //Set Label
                setLabelName();
            };

            function setLabelName() {
                document.getElementById('fileLabel').textContent = document.getElementById('uploadBtn').files[0].name;
            }
    </script>

</body>
</html>

<!-- Button that either shows or hides navigation bar (redundant)
<button type="button" id="sidebarOnMobile" class="btn btn-info">
    <i class="fas fa-bars"></i>
    <span>Toggle Sidebar</span>
</button>
-->