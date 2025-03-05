const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

// MongoDB Config
require("./mongodb/config");
const UserEmail = require("./mongodb/userEmail/userEmail");

app.use(bodyParser.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, origin);
    },
    credentials: true,
  })
);



const fs = require('fs');

const path = require('path');

const sendConfirmationEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465, // Use 587 for TLS if preferred
      secure: true, // Use false if port is 587
      tls: {
        rejectUnauthorized: true,
      },
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"CharkNest AI"<contact@charknest.com>`,
      to: email,
      subject: "Thank You for Connecting with CharkNest AI!",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
            
            </div>
            <h2 style="color: #5c6bc0; text-align: center;">Thank You for Connecting with CharkNest AI!</h2>
            <p>Dear valued user,</p>
            <p>Thank you for connecting CharkNest AI! We appreciate your interest in our platform and look forward to helping you explore the power of AI. Stay tuned for more updates and exciting features!</p>
            <p>Warm regards,</p>
            <p>The CharkNest AI Team</p>
            <footer style="margin-top: 30px; text-align: center; color: #777;">
              <p>Contact us: <a href="mailto:contact@charknest.com" style="color: #5c6bc0;">contact@charknest.com</a></p>
              <p>Follow us on <a href="#" style="color: #5c6bc0;">Instagram</a>, <a href="#" style="color: #5c6bc0;">LinkedIn</a></p>
            </footer>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};






app.post("/api/store/email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const existingEmail = await UserEmail.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newEmail = new UserEmail({ email });
    await newEmail.save();

    // Send confirmation email
    await sendConfirmationEmail(email);

    res.status(200).json({ message: "SuccessFull Subscribe CharkNest AI!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
