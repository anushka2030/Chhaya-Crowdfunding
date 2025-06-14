const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (to, otp) => {
  if (!to || !to.includes('@')) {
    console.error('Invalid recipient email:', to);
    throw new Error('Invalid recipient email address');
  }

  const mailOptions = {
    from: `"Chhaya Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP for Chhaya Login',
    html: `<h2>Your OTP is: ${otp}</h2><p>This OTP is valid for 5 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

module.exports = sendOTPEmail;
