const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `Test <${process.env.EMAIL_USER}>`,
  to: "anluong231123@gmail.com",
  subject: "Test Email",
  text: "This is a test email.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending test email:", error);
  } else {
    console.log("Test email sent:", info.response);
  }
});
