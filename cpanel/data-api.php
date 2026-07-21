<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Api-Key");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { exit(0); }
header("Content-Type: application/json");

$API_KEY = "cXbr0T00ls2026xK9mP3vR7";
$DATA_FILE = __DIR__ . "/data/store.json";
$DATA_DIR = __DIR__ . "/data";

if (!is_dir($DATA_DIR)) { mkdir($DATA_DIR, 0755, true); }
if (!file_exists($DATA_FILE)) { file_put_contents($DATA_FILE, "[]"); }

function readData() {
    global $DATA_FILE;
    $c = file_get_contents($DATA_FILE);
    $d = json_decode($c, true);
    return is_array($d) ? $d : array();
}

function writeData($arr) {
    global $DATA_FILE;
    return file_put_contents($DATA_FILE, json_encode(
        $arr, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
    ));
}

$method = $_SERVER["REQUEST_METHOD"];
$key = isset($_SERVER["HTTP_X_API_KEY"]) ? $_SERVER["HTTP_X_API_KEY"] : "";

if ($method === "GET") {
    $items = readData();
    $published = isset($_GET["published"]) && $_GET["published"] === "1";
    if ($published) {
        $items = array_values(array_filter($items, function($item) {
            return isset($item["published"]) && $item["published"];
        }));
    }
    echo json_encode(array("items" => $items, "count" => count($items)));
    exit;
}

if ($key !== $API_KEY) {
    http_response_code(401);
    echo json_encode(array("error" => "Unauthorized"));
    exit;
}

$raw = file_get_contents("php://input");
$payload = $raw ? json_decode($raw, true) : array();

if ($method === "POST") {
    $items = readData();
    if (!isset($payload["id"])) {
        http_response_code(400);
        echo json_encode(array("error" => "id required"));
        exit;
    }
    $payload["updatedAt"] = date("c");
    $idx = -1;
    foreach ($items as $i => $item) {
        if ($item["id"] === $payload["id"]) { $idx = $i; break; }
    }
    if ($idx >= 0) {
        $items[$idx] = $payload;
    } else {
        $items[] = $payload;
    }
    writeData($items);
    echo json_encode(array("success" => true, "count" => count($items)));
    exit;
}

if ($method === "PUT") {
    if (!isset($payload["id"])) {
        http_response_code(400);
        echo json_encode(array("error" => "id required"));
        exit;
    }
    $items = readData();
    $found = false;
    foreach ($items as $i => $item) {
        if ($item["id"] === $payload["id"]) {
            $payload["updatedAt"] = date("c");
            $items[$i] = $payload;
            $found = true;
            break;
        }
    }
    if (!$found) {
        http_response_code(404);
        echo json_encode(array("error" => "not found"));
        exit;
    }
    writeData($items);
    echo json_encode(array("success" => true));
    exit;
}

if ($method === "DELETE") {
    $id = isset($_GET["id"]) ? $_GET["id"] : (isset($payload["id"]) ? $payload["id"] : "");
    if (!$id) {
        http_response_code(400);
        echo json_encode(array("error" => "id required"));
        exit;
    }
    $items = readData();
    $items = array_values(array_filter($items, function($item) use ($id) {
        return $item["id"] !== $id;
    }));
    writeData($items);
    echo json_encode(array("success" => true, "count" => count($items)));
    exit;
}

http_response_code(405);
echo json_encode(array("error" => "Method not allowed"));
