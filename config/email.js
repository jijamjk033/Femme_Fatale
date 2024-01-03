const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const sendVarifyMail = async (email,req) => {

  const otp = generateOTP(4)
  req.session.otp = otp
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Your OTP Code for verification',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
      console.log('OTP:', otp);
    }
  });
  return otp
}


function generateOTP(length) {
  const characters = '0123456789'; // The characters to use for the OTP
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
}
module.exports = {

  sendVarifyMail,
}