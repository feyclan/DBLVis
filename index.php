<?php
// Start the session
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
                <li><a href="settings.php"><i class="fas fa-cog"></i><div>Settings</div></a></li>
                <!-- Button for navigation bar collapse <li id="sidebarCollapse"><a><i class="fas fa-bars"></i></a></li>-->
            </ul>
        </nav>

        <!-- Content of page -->
        <div id="content">
            <!-- Upload Card-->
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
            <!-- Success and error messages that show up after upload -->
            <div class="alert alert-success col-sm-3" role="alert" id="uploadMsgSuccess">
                <?php echo $_SESSION['uploadMsg']; ?>
            </div>
            <div class="alert alert-warning col-sm-3" role="alert" id="uploadMsgFail">
                <?php echo $_SESSION['uploadMsg']; ?>
            </div>
            <div class="card mb-3">
                <div class="card-header text-center">File Parser</div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-2">
                            <div class="card text-center border-0">
                                <div class="card-body">
                                    <button class="btn btn-info" id="parserBtn">Parse</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-10">
                            <div class="card">
                                <div class="card-body">
                                    <p class="card-text">Parser settings</p>
                                    <hr>
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
                                    <div class="form-check-inline">
                                        <input class="form-check-input" type="checkbox" value="" id="fastMode">
                                        <label class="form-check-label" for="fastMode">
                                            Fast Mode
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" id="progressBar">
                        <hr>
                        <div class="progress">
                            <div class="progress-bar bg-info" role="progressbar" id="progress"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="alert alert-success col-sm-3" role="alert" id="parserMsgSuccess">
                <p>Parsed File successfully.</p>
            </div>
            <div class="alert alert-warning col-sm-3" role="alert" id="parserMsgFail">
                <p>File failed to parse</p>
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

<!-- Button that either shows or hides navigation bar
<button type="button" id="sidebarOnMobile" class="btn btn-info">
    <i class="fas fa-bars"></i>
    <span>Toggle Sidebar</span>
</button>
-->