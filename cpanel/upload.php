<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { exit(0); }
header("Content-Type: application/json");

$dir = __DIR__ . "/images/uploads";
if (!is_dir($dir)) { mkdir($dir, 0755, true); }

$b64 = isset($_POST["base64"]) ? $_POST["base64"] : "";
$ext = isset($_POST["ext"]) ? preg_replace("/[^a-z0-9]/i", "", $_POST["ext"]) : "jpg";

if (!$b64) {
    http_response_code(400);
    echo json_encode(array("error" => "No base64 data"));
    exit;
}

$data = base64_decode($b64);
if ($data === false) {
    http_response_code(400);
    echo json_encode(array("error" => "Invalid base64"));
    exit;
}

if (strlen($data) > 10485760) {
    http_response_code(400);
    echo json_encode(array("error" => "File too large (max 10MB)"));
    exit;
}

$name = bin2hex(random_bytes(12)) . "-" . time() . "." . $ext;
$dest = $dir . "/" . $name;

if (file_put_contents($dest, $data) === false) {
    http_response_code(500);
    echo json_encode(array("error" => "Save failed"));
    exit;
}

$baseUrl = (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off"
    ? "https://" : "http://") . $_SERVER["HTTP_HOST"];

echo json_encode(array(
    "url" => $baseUrl . "/images/uploads/" . $name,
    "success" => true
));
