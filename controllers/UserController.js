const User = require('../models/User');
const otpService = require('../services/otpService');
const jwtService = require('../services/jwtService');


// Generate OTP API

exports.generateOTP = async (req, res) => {

    const {email} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            // creating a new user in db 
            user = new User({email});
        }

         // Check if user is blocked
        if(user.blockedUntil && user.blockedUntil > new Date()){
            const remainingTime = Math.ceil((user.blockedUntil - new Date()) / 60000); // Convert milliseconds to minutes
            return res.status(403).json({ message: `Account blocked. Please try after ${remainingTime} minutes.` });
        }

        // Check time gap since the last OTP generation
        if (user.otpTimestamp && (new Date() - user.otpTimestamp) / 1000 < 60) {
            return res.status(429).json({ message: 'Please wait for 1 minute before generating a new OTP.' });
        }

        // Generate and store OTP
        const otp = otpService.generateOTP();
        user.otp = otp;
        user.otpTimestamp = new Date();
        await user.save();

        // Send OTP to user's email
        await otpService.sendOTP(email, otp);

        return res.json({ message: 'OTP sent successfully.' });

    }catch(error){
        console.log(error);
        return res.status(500).json({message: 'An error occured while generating an OTP'});
    }

};


// Login API
exports.login = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      // Verify if the OTP is valid and has not expired
      const user = await User.findOne({ email });
      if (!user || user.otp !== otp || (new Date() - user.otpTimestamp) / 1000 > 300) {
        // Invalid OTP
        if (user) {
          // Increment wrong OTP attempts and block the account if necessary
          user.wrongAttempts = user.wrongAttempts ? user.wrongAttempts + 1 : 1;
          if (user.wrongAttempts >= 5) {
            user.blockedUntil = new Date(new Date().getTime() + 3600000); // Block for 1 hour
          }
          await user.save();
        }
        return res.status(401).json({ message: 'Invalid OTP.' });
      }
  
      // Reset wrong OTP attempts
      user.wrongAttempts = 0;
      await user.save();
  
      // Generate JWT token
      const token = jwtService.generateToken(user.email);
  
      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while logging in.' });
    }
  };