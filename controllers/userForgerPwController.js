const UserOTPVerificationModel = require("../models/userOTPVerificationModel");
const sendEmail = require("../services/send_email_for_OTP")
const LoginModel = require("../models/login_Model")
const UserModel = require("../models/user_Model");
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");


exports.emailVerification = async (req, res) => {

    const { email } = req.body;
    // const userId = req.body.userId;

    try {
        const userFoundResult = await UserModel.findOne({ where: { email: email } })


        // const find = await LoginModel.findAll()


        if (userFoundResult) {
            const loginFoundResult = await LoginModel.findOne({ where: { user_id: userFoundResult.user_id } })
            if (loginFoundResult) {
                sendOTPVerificationEmail(loginFoundResult.user_id, userFoundResult.email, res)
            } else {
                return res.json({
                    message: "Login Records Not found",
                    error: error.message,
                    status: "failed"
                })
            }
        }
        else {
           return res.json({
                message: "No one found with This Email address",
                status: "failed"
            })
        }
    } catch (error) {
        return res.json({
            message: "Error occured in email vrification",
            status: "failed"
        })
    }

}


exports.verifyOTP = async (req, res) => {
    try {
        if (!req.body || !req.body.userEnteredOtp || !req.body.email) {
            return res.status(400).send({
                error: "Please provide all required fields for this API",
                hint: "OTP and email is must"
            })
        }
        const { userEnteredOtp, email } = req.body;

        const findUser = await UserModel.findOne({
            attributes: { exclude: ['password'] },
            where: { email: email }
        });

        const findOtp = await UserOTPVerificationModel.findOne({
            attributes: { exclude: ['id'] },
            where: { user_id: findUser.user_id }
        })

        if (findOtp) {
            if (findOtp.otp == userEnteredOtp) {

                return res.status(200).json({
                    message: "User verification via OTP successfully done",
                    status: true,
                    data: findUser
                })
            } else {
                return res.status(400).json({
                    error: "entered OTP not matched, or it may expired",
                })
            }

        }
        else {
            return res.status(400).json({
                error: "OTP you entered is expired",
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error occured while verifing otp",
            error: error
        })
    }
}


// --------------------------(  send OTP Work)---------------------------------
const sendOTPVerificationEmail = async (user_id, email, res) => {
    try {
        // Generate 4 Digit OTP
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        const result = await UserOTPVerificationModel.findOne({ where: { user_id: user_id } })

        if (!result) {
            const newOTPVerif = await UserOTPVerificationModel.create({
                user_id: user_id,
                otp: otp,
                email: email,
            })
            if (newOTPVerif) {
                console.log("new otp saved");
            } else {
                console.log(err)
            }

        }
        else {
            const update = await UserOTPVerificationModel.update({ otp: otp },
                { where: { email: email } }
            )
        }

        const mailResponse = sendEmail.sendMailForOTPVerification(otp, email, "E-Shoping");
        if (mailResponse == true) {
            return res.status(200).json({
                message: `Sent a verification email to ${email}`,
                status: "pending",
                data: {
                    user_id: user_id,
                    otp: otp,
                    email: email
                }
            });
        }
    }
    catch (error) {
        return res.json({
            error: error.message,
            message: "error occured while generating otp and sending Mail"
        })
    }

}


// --------------------------( Update password Work)---------------------------------
module.exports.updatePassword = async (req, res, next) => {
    try {
        // decrypt passwaro before storing it in database 
        const hashedPass = await bcrypt.hash(req.body.new_password, 5);
        const result = await UserModel.update({ password: hashedPass }, { where: { email: req.body.email } })

        if (result) {
            const find = await UserModel.findOne({ where: { email: req.body.email } })
            await UserOTPVerificationModel.destroy({
                // truncate: true, //this will empty all table
                // cascade: true, // this will help above command to deleted that data also which i reffering to its id primary key
                // restartIdentity: true, // this will help above truncate command to reset the promary key
                where: {
                    user_id: find.user_id
                }
            })

            // logout user with same credentials if he is already login
            // so he can login with new records
            await LoginModel.destroy({ where: { user_id: find.user_id } })

            return res.send({
                message: "password changed successfully, now you can login again",
                // new_user_info: find
                status: "success"
            })
        }

    } catch (error) {
        console.log(error)
        return res.send({
            message: "Error occured while changing password",
        })
    }
}
