const express = require("express");
const router = express.Router();
const CatalogTypeController = require("../controllers/catalogTypeController")

router.route("/catalog-types/all").get(CatalogTypeController.getAllCatalogTypes);
router.route("/catalog-types/:cId").get(CatalogTypeController.getSingleCatalogType);
router.route("/catalog-types/new").post(CatalogTypeController.createCatalogType);
router.route("/catalog-types/update/:cId").put(CatalogTypeController.updateCatalogType);
router.route("/catalog-types/remove/:cId").delete(CatalogTypeController.removeCatalogType);

module.exports = router;