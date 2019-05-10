<!-- 
@author: Frederik Ondrikov
@date: 29-04-2019
@comment: This is the php file which makes it possible to upload files to the website.
-->

<?php
// Start the session
session_start();

if (isset($_POST['submit'])) {
	$file = $_FILES['file'];

	//defining variables
	$file_Name = $_FILES['file']['name'];
	$file_Temp_Name = $_FILES['file']['tmp_name'];
	$file_Size = $_FILES['file']['size']; //not used since we do not know how big the files are going to be!
	$file_Error = $_FILES['file']['error'];
	$file_Type = $_FILES['file']['type'];
	
	$fileExt = explode('.', $file_Name);
	$fileActualExt = strtolower(end($fileExt));

	$allowed = array('csv'); //which kind of files are allowed
	
	if (in_array($fileActualExt, $allowed)) {                             //Is the filetype allowed? (is it a .csv-file?)
		if ($file_Error === 0) {										  //Are there errors with the given file?
				$file_NameNew = "data.".$fileActualExt;//uniqid('', true).".".$fileActualExt;
				$fileDestination = '../uploads/'.$file_NameNew;
				move_uploaded_file($file_Temp_Name, $fileDestination);
                $_SESSION['uploadISSET'] = true;
                $_SESSION['uploadMsg'] = "File uploaded";
				header("Location: ../index.php");                        //upload file to the map "uploads"

			} else {
            $_SESSION['uploadISSET'] = true;
            $_SESSION['uploadMsg'] = "There was an error uploading the file!";                //There is something wrong with the given file!
            header("Location: ../index.php");
        }
	} else {
        $_SESSION['uploadISSET'] = true;
        $_SESSION['uploadMsg'] = "You are only allowed to upload .csv files!";                //The given file is not a .csv-file!
        header("Location: ../index.php");
    }
}


?>