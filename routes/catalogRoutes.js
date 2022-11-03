const express = require("express");
const router = express.Router();
const CatalogController = require("../controllers/catalogController")

router.route("/catalogs/all").get(CatalogController.getAllCatalogs);
router.route("/catalogs/:cId").get(CatalogController.getSingleCatalog);
router.route("/catalogs/new").post(CatalogController.createCatalog);
router.route("/catalogs/update/:cId").put(CatalogController.updateCatalog);
router.route("/catalogs/remove/:cId").delete(CatalogController.removeCatalog);

module.exports = router;