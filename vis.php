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
            <li><a  href="settings.php"><i class="fas fa-cog"></i><div>Settings</div></a></li>
            <!-- Button for navigation bar collapse <li id="sidebarCollapse"><a><i class="fas fa-bars"></i></a></li>-->
        </ul>
    </nav>

    <!-- Content of page -->
    <div id="content">

        <!-- Visualisation Card-->
        <div class="card text-center mb-3">
            <div class="card-header text-right">
                <button class="btn btn-primary" id="visGraph">
                    Visualize
                </button>
                <a class="btn btn-primary" data-toggle="collapse" href="#settings" role="button" aria-expanded="false" aria-controls="settings">
                    <i class="fas fa-wrench"></i>
                </a>
                <a class="btn btn-primary" data-toggle="collapse" href="#info" role="button" aria-expanded="false" aria-controls="info">
                    <i class="fas fa-info"></i>
                </a>
                <a class="btn btn-primary" data-toggle="collapse" href="#visualisation" role="button" aria-expanded="false" aria-controls="visualisation">
                    <i class="fas fa-expand"></i>
                </a>
            </div>
            <div class="collapse" id="settings">
                <div class="card-body">
                    <form>
                        <div class="form-row align-items-center">
                            <div class="col-auto">
                                <label class="sr-only" for="width-form">Width</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Width</div>
                                    </div>
                                    <input type="text" class="form-control" id="width-form" placeholder="px" value="">
                                </div>
                            </div>
                            <div class="col-auto">
                                <label class="sr-only" for="height-form">Height</label>
                                <div class="input-group mb-2">
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Height</div>
                                    </div>
                                    <input type="text" class="form-control" id="height-form" placeholder="px" value="">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="collapse" id="info">
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
                                        <div class="form-control" id="nodeName"></div>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">X :</div>
                                        </div>
                                        <div class="form-control" id="nodeX"></div>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">Y :</div>
                                        </div>
                                        <div class="form-control" id="nodeY"></div>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            <div class="collapse" id="visualisation">
                <div class="card-body">
                    <canvas id="visCanvas" width="1000" height="1000"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<!-- D3 libraries -->
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/d3.v2.min.js"></script>

<!-- Visualisation Script -->
<script src="js/vis.js"></script>

</body>
</html>

<!-- Button that either shows or hides navigation bar
<button type="button" id="sidebarOnMobile" class="btn btn-info">
    <i class="fas fa-bars"></i>
    <span>Toggle Sidebar</span>
</button>
-->