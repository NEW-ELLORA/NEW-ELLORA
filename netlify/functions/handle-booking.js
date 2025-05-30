// File: NEW-ELLORA/netlify/functions/handle-booking.js

// Import Nodemailer. Netlify will try to install this if it's not in your package.json,
// but it's best practice to have a package.json in your project root listing 'nodemailer' as a dependency.
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Define CORS Headers - Essential for cross-origin requests from your frontend
    const headers = {
        'Access-Control-Allow-Origin': 'https://new-ellora.netlify.app', // Restrict to your specific Netlify site URL
        'Access-Control-Allow-Headers': 'Content-Type',                  // Allow 'Content-Type' header
        'Access-Control-Allow-Methods': 'POST, OPTIONS'                   // Allow POST and OPTIONS (for preflight)
    };

    // Handle OPTIONS preflight request for CORS
    // Browsers automatically send an OPTIONS request before a 'complex' POST request
    // (like one with a Content-Type of application/json) to a different origin.
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content - Standard success for OPTIONS
            headers: headers,
            body: ''         // Body must be empty for OPTIONS
        };
    }

    // Ensure only POST requests are processed for actual data submission
    if (event.httpMethod !== 'POST') {
        console.log(`Method Not Allowed: Received ${event.httpMethod}`);
        return {
            statusCode: 405, // Method Not Allowed
            headers: headers, // Include CORS headers even for errors
            body: JSON.stringify({ message: 'Only POST requests are allowed for this endpoint.' })
        };
    }

    try {
        // Parse the incoming JSON data from the booking form
        // event.body is a string, so it needs to be parsed into a JavaScript object
        const bookingData = JSON.parse(event.body);
        console.log("Netlify Function 'handle-booking' received data:", JSON.stringify(bookingData, null, 2)); // Pretty print object for logs

        // --- Basic Server-Side Validation ---
        if (!bookingData.userName || !bookingData.phoneNumber || !bookingData.occasionName || !bookingData.occasionLocation) {
            console.error("Validation Failed: Missing one or more required fields.", bookingData);
            return {
                statusCode: 400, // Bad Request
                headers: headers,
                body: JSON.stringify({ message: "Validation Error: Please fill in all required fields (Name, Phone, Occasion Name, Location)." })
            };
        }

        // --- Configure Nodemailer using Environment Variables ---
        // These MUST be set in your Netlify site's UI:
        // Site configuration > Build & deploy > Environment > Environment variables
        // - EMAIL_USER: Your Gmail address (or sender email)
        // - EMAIL_PASS: Your Gmail App Password (if using Gmail with 2FA) or email password
        // - COMPANY_HEAD_EMAIL: The recipient's email address

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.COMPANY_HEAD_EMAIL) {
            console.error("CRITICAL CONFIGURATION ERROR: Email environment variables (EMAIL_USER, EMAIL_PASS, COMPANY_HEAD_EMAIL) are not set in Netlify.");
            return {
                statusCode: 500, // Internal Server Error
                headers: headers,
                body: JSON.stringify({ message: "Server configuration error: The email service is not properly set up. Please contact support." })
            };
        }

        // Create Nodemailer transporter (using Gmail as an example)
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",     // Gmail SMTP server
            port: 465,                  // SSL port
            secure: true,               // Use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Optional: Enable for detailed SMTP logs in Netlify Functions logs
            // logger: true,
            // debug: true,
        });

        // --- Construct Email Content ---
        // Handle potentially undefined or empty arrays/strings gracefully
        const preferredLanguagesText = (bookingData.preferredLanguages && bookingData.preferredLanguages.length > 0)
            ? bookingData.preferredLanguages.join(', ')
            : 'Not specified';

        const occasionLocationValue = bookingData.occasionLocation || 'Not specified';
        // If your client sends occasionLocationText:
        // const occasionLocationText = bookingData.occasionLocationText || occasionLocationValue;


        const mailOptions = {
            from: `"New Ellora Booking System" <${process.env.EMAIL_USER}>`, // Sender address (shows in "From" field)
            to: process.env.COMPANY_HEAD_EMAIL,                          // Recipient
            subject: `🎉 New Booking Request: ${bookingData.occasionName || 'N/A'} by ${bookingData.userName || 'N/A'}`,
            text: `You have a new booking request!\n\n` +
                  `Personal Details:\n` +
                  `-----------------\n` +
                  `Name: ${bookingData.userName || 'N/A'}\n` +
                  `Phone: ${bookingData.phoneNumber || 'N/A'}\n` +
                  `Preferred Languages: ${preferredLanguagesText}\n\n` +
                  `Occasion Details:\n` +
                  `-----------------\n` +
                  `Venue Region/District: ${occasionLocationValue}\n` + // Using the value from select
                  `Occasion Name: ${bookingData.occasionName || 'N/A'}\n` +
                  `Full Address: ${bookingData.occasionAddress || 'Not specified'}\n` +
                  `Approx. Guests: ${bookingData.numberOfMembers || 'Not specified'}\n\n` +
                  `Client Submission Timestamp: ${bookingData.timestamp ? new Date(bookingData.timestamp).toLocaleString() : 'N/A'}\n\n` +
                  `Please review and follow up promptly.`,
            html: `<h1>🎉 New Booking Request!</h1>
                   <h2>Personal Details:</h2>
                   <p><strong>Name:</strong> ${bookingData.userName || 'N/A'}</p>
                   <p><strong>Phone:</strong> ${bookingData.phoneNumber || 'N/A'}</p>
                   <p><strong>Preferred Languages:</strong> ${preferredLanguagesText}</p>
                   <hr>
                   <h2>Occasion Details:</h2>
                   <p><strong>Venue Region/District:</strong> ${occasionLocationValue}</p>
                   <p><strong>Occasion Name:</strong> ${bookingData.occasionName || 'N/A'}</p>
                   <p><strong>Full Address:</strong> ${bookingData.occasionAddress || 'Not specified'}</p>
                   <p><strong>Approx. Guests:</strong> ${bookingData.numberOfMembers || 'Not specified'}</p>
                   <hr>
                   <p><strong>Client Submission Timestamp:</strong> ${bookingData.timestamp ? new Date(bookingData.timestamp).toLocaleString() : 'N/A'}</p>
                   <p><em>Please review and follow up promptly.</em></p>`
        };

        // --- Send Email ---
        console.log(`Attempting to send email via ${process.env.EMAIL_USER} to ${process.env.COMPANY_HEAD_EMAIL}...`);
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully! Message ID:", info.messageId);
        // If using Ethereal for testing, this would show a preview URL:
        // console.log("Preview URL for Ethereal:", nodemailer.getTestMessageUrl(info));

        // Return a success response to the client
        return {
            statusCode: 200, // OK
            headers: headers,
            body: JSON.stringify({ message: "Booking request submitted successfully! We will contact you shortly regarding confirmation." })
        };

    } catch (error) {
        // Log the detailed error on the server (Netlify logs)
        console.error("--- ERROR IN NETLIFY FUNCTION 'handle-booking' ---");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        // For SMTP errors, Nodemailer often includes a 'responseCode' or 'code'
        if (error.responseCode) console.error("SMTP Error Code:", error.responseCode);
        if (error.code) console.error("Error Code:", error.code); // E.g., EAUTH, ECONNREFUSED
        console.error("Full Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2)); // Log the full error structure
        // It's also good to log the original event body if an error occurs, in case parsing failed
        // or to see what data caused an issue.
        console.error("Original Event Body String (if available):", event ? event.body : "event undefined");


        let userErrorMessage = "We encountered an issue while processing your booking. Please try again later or contact support.";

        // Provide slightly more specific (but still safe) messages for common, identifiable issues
        if (error.message) {
            const lowerErrorMsg = error.message.toLowerCase();
            if (lowerErrorMsg.includes("invalid login") || lowerErrorMsg.includes("authentication failed") || (error.code && error.code === 'EAUTH')) {
                userErrorMessage = "Server Error: Email authentication failed. The site administrator has been notified (check server logs).";
            } else if (error.name === 'SyntaxError' && lowerErrorMsg.includes('json')) {
                // This usually means event.body was not valid JSON
                userErrorMessage = "Server Error: The data sent from the form could not be understood. Please try again.";
            } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                userErrorMessage = "Server Error: Could not connect to the email service. Please try again later."
            }
        }

        // Return an error response to the client
        return {
            statusCode: 500, // Internal Server Error
            headers: headers,
            body: JSON.stringify({
                message: userErrorMessage
                // Do NOT send sensitive error details like error.stack to the client in production
            })
        };
    }
};
