const nodemailer = require('nodemailer');

// Generate random OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user's email
exports.sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({

        pool: true,
        host: 'smtp.gmail.com', 
        port: 465 || 587 || 25, 
        secure: false, 
        auth: {
            user: 'healthcode63@gmail.com', 
            pass: 'D@t@D!@b3t3$12', 
        },
        timeout: 10000,
   
    });

    await transporter.sendMail({
      from: 'healthcode63@gmail.com',
      to: email,
      subject: 'OTP for Login',
      text: `Your OTP: ${otp}`,
    });
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while sending the OTP.');
  }
};
