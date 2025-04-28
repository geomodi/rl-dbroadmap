<?php
// Set headers to handle CORS and JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Get the posted data
$data = json_decode(file_get_contents("php://input"));

// Validate data
if (
    empty($data->subject) ||
    empty($data->message)
) {
    // Return error response
    http_response_code(400);
    echo json_encode(array("message" => "Unable to send email. Subject and message are required."));
    exit();
}

// Set email parameters
$to = "alex@repairlift.com";
$subject = "Message from Dashboard: " . $data->subject;
$message = $data->message;
$headers = "From: dashboard@repairlift.com\r\n";
$headers .= "Reply-To: noreply@repairlift.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Try to send the email
if (mail($to, $subject, $message, $headers)) {
    // Success response
    http_response_code(200);
    echo json_encode(array("message" => "Email sent successfully."));
} else {
    // Error response
    http_response_code(500);
    echo json_encode(array("message" => "Email could not be sent."));
}
?>
