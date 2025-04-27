// Example serverless function for AWS Lambda or similar
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    // Parse the incoming request body
    const body = JSON.parse(event.body);
    
    // Validate the request
    if (!body.subject || !body.message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Subject and message are required' })
        };
    }
    
    // Configure email transporter
    // Note: In a real implementation, you would use environment variables for these credentials
    const transporter = nodemailer.createTransport({
        host: 'your-smtp-server.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your-email@example.com',
            pass: 'your-password'
        }
    });
    
    // Email options
    const mailOptions = {
        from: 'dashboard@repairlift.com',
        to: 'alex@repairlift.com',
        subject: `Message from Dashboard: ${body.subject}`,
        text: body.message
    };
    
    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        
        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' })
        };
    } catch (error) {
        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending email', error: error.message })
        };
    }
};
