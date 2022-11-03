const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController")
const multerUploader = require("../middlewares/multerUploder")

router.route("/products/all").get(ProductController.getAllProductsById);
router.route("/products/:pId").get(ProductController.getSingleProductById);
router.route("/products/new").post(multerUploader.uploadProductImage, ProductController.addNewProducts);
router.route("/products/update/:pId").put(multerUploader.uploadProductImage,  ProductController.updateProductById);
router.route("/products/remove/:pId").delete(multerUploader.uploadProductImage, ProductController.removeProductById);

module.exports = router;