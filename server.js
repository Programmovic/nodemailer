const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


// Enable CORS for all routes
app.use(cors());
// Parse JSON and form dataa
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Define an email sending route
app.post('/sendEmail', async (req, res) => {

  try {
    const { name, email, subject, message } = req.body;

    // Create a Nodemailer transporter for the initial email to your company
    const transporter = nodemailer.createTransport({
      host: "send.one.com", // Use the SMTP server provided
      port: 465, // Use the SMTP port provided
      secure: true, // Use secure connection
      auth: {
        user: "contact@b-circles.co", // Your email address
        pass: "A_123456", // Your email password
      },
    });

    // Define email data with HTML content for the initial email to your company
    const initialEmailOptions = {
      from: "contact@b-circles.co", // Your email address
      to: "support@b-circles.co", // Recipient's email address (your company's support email)
      subject: subject,
      // Use HTML content for the email body
      html: `
        <html>
        <head>
          <!-- Add any CSS styles here -->
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .header {
              background-color: #007bff;
              color: #fff;
              padding: 10px;
              text-align: center;
            }
            .content {
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Contact Form Submission</h1>
            </div>
            <div class="content">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
          </div>
        </body>
      </html>
        `,
    };

    // Send the initial email to your company
    await transporter.sendMail(initialEmailOptions);

    // Create a Nodemailer transporter for the response email to the sender
    const responseTransporter = nodemailer.createTransport({
      host: "send.one.com", // Use the SMTP server provided
      port: 465, // Use the SMTP port provided
      secure: true, // Use secure connection
      auth: {
        user: "contact@b-circles.co", // Your email address
        pass: "A_123456", // Your email password
      },
    });

    // Define email data with HTML content for the response email to the sender
    const responseEmailOptions = {
      from: "contact@b-circles.co", // Your email address
      to: email, // Sender's email address
      subject: "Thank You for Contacting Us",
      // Use HTML content for the email body
      html: `
          <html>
            <head>
              <!-- Add any CSS styles here -->
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
                .container {
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f5f5f5;
                }
                .header {
                  background-color: #007bff;
                  color: #fff;
                  padding: 10px;
                  text-align: center;
                }
                .content {
                  padding: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Contacting Us</h1>
                </div>
                <div class="content">
                  <p>Dear ${name.split(' ')[0]},</p>
                  <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
                  <p>Best regards,</p>
                  <a href='https://b-circles.co/'>B-Circles</a>
                </div>
              </div>
            </body>
          </html>
        `,
    };

    // Send the response email to the sender
    await responseTransporter.sendMail(responseEmailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
