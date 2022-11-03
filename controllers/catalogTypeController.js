const CatalogModel = require("../models/catalog_Model");
const CatalogTypeModel = require("../models/catalog_type_Model");
const ProductModel = require("../models/product_Model");

// ---------------------(Create new Product_type Work)---------------------
module.exports.createCatalogType = async (req, res) => {
    if (req.body.length == 0) {
        return res.status(400).send({
            message: "Body can not be empty!"
        });
    }
    try {
        console.log(req.body)
        const result = await CatalogTypeModel.create(req.body)
        if (result) {
            // Searching new product to show associated catalog 
            const find = await CatalogTypeModel.findByPk(result.catalog_type_id, {
                include: [{
                    model: CatalogModel,
                }]
            })
            res.status(200).send({
                message: "new catalog type",
                catalog_type: find,
            });
        } else {
            res.status(400).send({
                message: "product type can not add",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Unable to create new product type',
            error:error
        })
    }
} 

// ---------------------(Get All Product_types Work)---------------------
module.exports.getAllCatalogTypes = async (req, res) => {

    try {
        const result = await CatalogTypeModel.findAll({
            include: [{
                model: CatalogModel,
                include: [{
                    model: ProductModel,
                }],
            }]
        })
        if (result) {
            res.status(200).send({
                message: "search result",
                catalog_type: result,
            });
        } else {
            res.status(400).send({
                message: "catalog type is not found",
                catalog_type: result,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error occured while searching catalog type',
            error: error
        })
    }
} 

// ---------------------(Get Single Product_type Work)---------------------
module.exports.getSingleCatalogType = async (req, res) => {
    try {
        const result = await CatalogTypeModel.findByPk(req.params.cId,{
            include: [{
                model: CatalogModel,
                include: [{
                    model: ProductModel,
                }],
            }]
        })
        if (result) {
            res.status(200).send({
                message: "search result",
                catalog_type: result,
            });
        } else {
            res.status(400).send({
                message: "catalog not found",
                catalog_type: result,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error Occured while searching for catalog type',
            error: error
        })
    }
} 

// ---------------------(Update Single Product_type Work)---------------------
module.exports.updateCatalogType = async (req, res) => {
    try {
        const result = await CatalogTypeModel.update(req.body, {
            where: {
                catalog_type_id: req.params.cId
            }
        });
        if (result) {
            const find = await CatalogTypeModel.findByPk(req.params.cId)
            res.status(200).send({
                message: "update result",
                catalog_type: find,
            });
        } else {
            res.status(400).send({
                message: "catalog type not found",
                catalog_type: result,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error Occured while updating catalog type',
            error: error
        })
    }
} 

// ---------------------(Remove Single Product_type Work)---------------------
module.exports.removeCatalogType = async (req, res) => {
    try {
        const result = await CatalogTypeModel.destroy({
            where: {
                catalog_type_id: req.params.cId
            }
        })
        if (result) {
            res.status(200).send({
                message: "catalog type removed successfully",
                catalog_type: result,
            });
        } else {
            res.status(400).send({
                message: "catalog type not found",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "error occured while deleting catalog type",
            error: error,
        });
    }
} 