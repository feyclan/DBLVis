<?php
// Check if action parameter is set
if(isset($_POST['action']) && !empty($_POST['action'])) {
    switch($_POST['action']) {
        case 'nodelink' :
            //Set path for file upload
            $myFile = "../uploads/parsed/data_parsed_node-link.json";
            break;
        case 'matrix' :
            //Set path for file upload
            $myFile = "../uploads/parsed/data_parsed_matrix.json";
            break;
    }
    //Write file to path
    $fh = fopen($myFile, 'w') or die("can't open file");
    $stringData = $_POST["data"];
    fwrite($fh, $stringData);

    //Close connection
    fclose($fh);
}


