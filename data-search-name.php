<?php
    // Change Here

    $qColumn = "name";
    $qFrom = "test_table";
    $qJoin = "";
    $qWhere = "";

    // Stop changing here

    $config = include_once 'config.php';
    $conn = new mysqli($config['host'], $config['name'], $config['pass'], $config['db']);
    if(!$conn) exit;

    $limit = $conn->real_escape_string(intval($_POST['limit'] ?? 0));
    $search_text = $conn->real_escape_string($_POST['search_text'] ?? '');

    $qLimit = ($limit && $limit > 0) ? "LIMIT 0, $limit;" : "";
    if(strlen($search_text) > 0) {
        $qWhere .= (strpos($qWhere, 'WHERE') === false ? "WHERE (" : " AND (") . $qColumn . " LIKE '%$search_text%')";
    }

    $result = $conn->query("SELECT $qColumn FROM $qFrom $qJoin $qWhere GROUP BY $qColumn $qLimit");

    $rData = $result->fetch_all(MYSQLI_NUM);

    $output = array();
    for($a = 0; $a < count($rData); $a++) {
        array_push($output, $rData[$a][0]);
    }

    echo json_encode($output);
    exit;