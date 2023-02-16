<?php

    // połączenie do bazy danych
   $servername = "localhost";
   $username = "root";
   $password = "";
   $dbname = "ckeditor";

   $conn = new mysqli($servername, $username, $password, $dbname);

   if ($conn->connect_error)
   {
       die("Connection failed: ".$conn->conect_error);
   }

    // wkładanie do tabeli
   if ($_SERVER["REQUEST_METHOD"] == "POST")
   {
       $min = $_POST['min'];
       $standard = $_POST['standard'];
       $custom = $_POST['custom'];
       $sql = "INSERT INTO ckeditor (min,standard,custom) VALUES ('$min','$standard','$custom')";

       if ($conn->query($sql) === TRUE)
       {
           header('Location:index.html');
       }
       else
       {
           echo "Error: ".$sql."<br>".$conn_->error;
       }
   }

?>