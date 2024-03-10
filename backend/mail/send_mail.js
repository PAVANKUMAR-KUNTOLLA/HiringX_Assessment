const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});

const sendEmail = async (email, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_HOST_USER,
    to: email,
    subject: subject,
    text: text,
    // Add any other options you need
  };

  try {
    // Send email using Nodemailer
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return "Email sent successfully";
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
