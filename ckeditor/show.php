<?php
    include('ckeditor.php');

    $sql = "SELECT * FROM ckeditor";
    $result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Show</title>

    <link rel="stylesheet" href="style.css">

</head>
<body>
    
    <main>
        <table>
            <tr>
                <th>ID</th>
                <th>Min</th>
                <th>Standard</th>
                <th>Custom</th>
            </tr>

            <!-- wyświetlanie w tabeli -->
            <?php
                while($row = $result->fetch_assoc())
                {
            ?>
            
            <tr>
                <!-- wyświetlanie id -->
                <td>
                <?php
                    echo $row['id']
                ?>
            </td>

            <td>
                <!-- wyświetlanie minimum -->
                <?php
                    echo $row['min']
                ?>
            </td>

            <td>
                <!-- wyświetlanie standard -->
                <?php
                    echo $row['standard']
                ?>
            </td>
            <td>
                <!-- wyświetlanie custom -->
                <?php
                    echo $row['custom']
                ?>
            </td>
            </tr>
            <?php 
                }
            ?>
            </table>
    </main>
</body>
</html>