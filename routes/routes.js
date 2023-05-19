const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/generate-otp', UserController.generateOTP );
// router.post('/login', UserController.login );



module.exports = router;