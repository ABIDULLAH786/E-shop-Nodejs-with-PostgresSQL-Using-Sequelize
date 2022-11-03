const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_Controller");
const userForgerPwController = require("../controllers/userForgerPwController");
const multerUploader = require("../middlewares/multerUploder");
const authToken = require("../middlewares/userAuthentication");

router.route("/auth/users/signup").post(multerUploader.uploadUserImage, authController.signup);
router.route("/auth/users/login").post(authController.login);
router.route("/test/all-users").get(authController.allUsers);
router.route("/test/jwt-token").get(authToken, authController.testToken);

router.route("/api/auth/request-reset-password").post(userForgerPwController.emailVerification);
router.route("/api/auth/verify-otp").post(userForgerPwController.verifyOTP);
router.route("/api/auth/update-password").post(userForgerPwController.updatePassword);

module.exports = router;