const nodemailer = require('nodemailer');


const sendVarifyMail = async (email, req) => {
  try {

    const otp = generateOTP(4);

    req.session.otp = otp;

    console.log(req.session.otp, "otp")
    const transporter = nodemailer.createTransport({

      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: `${process.env.USER}`,
        pass: `${process.env.PASSWORD}`,
      },
    });
    const mailOptions = {
      from: `${process.env.USER}`,
      to: email,
      subject: 'For verification purpose',
      html: `<p>Hello,\n Welcome to Femme Fatale.\nHere is the OTP for your registration : <strong>${otp}</strong>. Enter this to verify your Email. Please do not share this password with anyone.</p>`,
    };
    const information = await transporter.sendMail(mailOptions);
    console.log(information.messageId);
  } catch (error) {
    console.log(error);
  }

};

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