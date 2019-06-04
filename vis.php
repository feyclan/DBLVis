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
            <li><a class="add" id="addGraph"><i class="fas fa-plus"></i><div>Add Graph</div></a></li>
        </ul>
    </nav>

    <!-- Content of page -->
    <div id="content">
            <div class='element' id='div-1'>
            </div>
    </div>
</div>

<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<!-- D3 libraries -->
<script src="https://d3js.org/d3.v4.min.js"></script>
<!-- Color Picker -->
<script src="js/jscolor.js" type="module"></script>
<!-- GUI Builder Script -->
<script src="js/guiBuilder.js" type="module"></script>
<!-- Visualisation Script -->
<script src="js/vis.js" type="module"></script>
<!-- Clustering Scripts -->
<script src="js/netclustering.js" type="module"></script>
<script src="js/algo.js" type="module"></script>

</body>
</html>