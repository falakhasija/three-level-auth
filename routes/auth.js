const express = require('express');
const router = express.Router();

const accountSid = "ACc5a66f3c36ebfb72939f4f7037e949ca";
const authToken = "e69a73661c1dec7b0b6c32ef5e5335b6";

const client = require('twilio')(accountSid, authToken);

const { ensureAuthenticated } = require('../config/checkAuth')


//------------ Importing Controllers ------------//
const authController = require('../controllers/authController')

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));

//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});

// otp
router.get('/otp', ensureAuthenticated, (req, res) => {

    mobile='+91'+req.user.mobile;
    console.log("otp sent to"+mobile);

    client.verify.services('VAdc809252226e16eb072d02af65cd6a44')
        .verifications
        .create({to: mobile, channel: 'sms'})
        .then(verification => console.log(verification.status));

    res.render('otp');
});

router.post('/otp',(req, res) => {
    
    mobile='+91'+req.user.mobile;
    otp=req.body.code;
    console.log(otp);

    client.verify.services('VAdc809252226e16eb072d02af65cd6a44')
        .verificationChecks
        .create({to: mobile, code: otp})
        .then(verification_check => {
            console.log(verification_check.status)
            if(verification_check.status == "approved"){
                res.redirect('/dashboard');
            }
        });

});

//------------ Register Route ------------//
router.get('/register', (req, res) => res.render('register'));

//------------ Register POST Handle ------------//
router.post('/register', authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);

//------------ Forgot Password Handle ------------//
router.post('/forgot', authController.forgotPassword);

//------------ Reset Password Handle ------------//
router.post('/reset/:id', authController.resetPassword);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', authController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle); 

module.exports = router;