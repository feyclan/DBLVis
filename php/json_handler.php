<?php
//Set path
$myFile = "../uploads/parsed/data_parsed_node-link.json";
//Write File
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
//Close connection
fclose($fh)
?>
