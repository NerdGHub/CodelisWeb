<?php
// register.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit;
}

// Extract data
$forename = $data['forename'] ?? '';
$surname = $data['surname'] ?? '';
$email = $data['email'] ?? '';
$mobile = $data['mobile'] ?? '';
$dob = $data['dob'] ?? '';
$password = $data['password'] ?? '';

// Validate (lightly, since JS handles it too)
if (!$forename || !$surname || !$email || !$mobile || !$dob || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// Connect to MySQL
$host = "localhost";
$db = "codelis_db";
$user = "agent";
$pass = "";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Hash the password before storing
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database (assumes `users` table exists)
$stmt = $conn->prepare("INSERT INTO users (forename, surname, email, mobile, dob, password) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $forename, $surname, $email, $mobile, $dob, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["message" => "User registered successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to register user"]);
}

$stmt->close();
$conn->close();
?>
