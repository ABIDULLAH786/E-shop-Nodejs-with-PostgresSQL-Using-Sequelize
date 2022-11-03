const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_Controller");
const multerUploader = require("../middlewares/multerUploder");
const validations = require("../middlewares/validations");
 
router.route("/auth/users/signup").post(multerUploader.uploadUserImage, authController.signup);
router.route("/auth/users/login").get(authController.login);
router.route("/test/all-users").get(authController.allUsers);
// router.route("/users/forget-password").post(CatalogController.createCatalog);

module.exports = router;