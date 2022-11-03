const nodemailer = require('nodemailer');
const emailOTPBody = require("../utils/emailOTPBody")

module.exports.sendMailForOTPVerification = (otp, email, email_body_title) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const options = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Verify Account',
        html: emailOTPBody(otp, email_body_title)
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                message: `Error occured while sending account verification OTP`,
                error: error
            });
        }
    })
    return true;
}


