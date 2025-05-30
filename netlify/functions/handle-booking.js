// File: NEW-ELLORA/netlify/functions/handle-booking.js

exports.handler = async (event) => {
    console.log("Function 'handle-booking' was called!");
    console.log("HTTP Method:", event.httpMethod);
    console.log("Received Body:", event.body);

    // For now, just send a simple success message
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow requests from anywhere for now
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: "Hello from handle-booking function!" })
    };
};
