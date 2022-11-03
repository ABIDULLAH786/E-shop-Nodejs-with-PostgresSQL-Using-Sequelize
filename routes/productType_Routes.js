const express = require("express");
const router = express.Router();
const ProductTypeController = require("../controllers/productTypeController")

router.route("/product-types/all").get(ProductTypeController.getAllProductTypes);
router.route("/product-types/:pId").get(ProductTypeController.getSingleProductType);
router.route("/product-types/new").post(ProductTypeController.createProductType);
router.route("/product-types/update/:pId").put(ProductTypeController.updateProductType);
router.route("/product-types/remove/:pId").delete(ProductTypeController.removeProductType);

module.exports = router;