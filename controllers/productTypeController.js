const ProductTypeModel = require("../models/product_type_Model");
const ProductModel = require("../models/product_Model");
const CatalogModel = require("../models/catalog_Model");
const CatalogTypeModel = require("../models/catalog_type_Model");


// ---------------------(Create New Product-Type Work)---------------------
module.exports.createProductType = async (req, res) => {
    if (req.body.length == 0) {
        return res.status(400).send({
            message: "Body can not be empty!"
        });
    }
    try {
        console.log(req.body)
        const result = await ProductTypeModel.create(req.body)
        if (result) {
            res.status(200).send({
                message: "new product type",
                product_type: result,
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
            error: error
        })
    }
}

// ---------------------(Get All Product-Types Work)---------------------
module.exports.getAllProductTypes = async (req, res) => {
    console.log("here");
    try {
        const result = await ProductTypeModel.findAll(
            {
                include: [{
                    model: ProductModel,
                }],
            }
        )
        if (result) {
            res.status(200).send({
                message: "search result",
                products: result,
            });
        } else {
            res.status(400).send({
                message: "product type is not found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error occured while searching product type',
            error: error
        })
    }
}

// ---------------------(Get Single Product-Type Work)---------------------
module.exports.getSingleProductType = async (req, res) => {
    try {

        const checkProduct = await ProductModel.findAll();
        if (checkProduct) {
            console.log("Product is not empty")
        }
        console.log("Product is empty")

        // If the product table/model is empty then find without association
        const result = await ProductTypeModel.findByPk(req.params.pId, checkProduct && {
            include: [{
                model: ProductModel,
                include: [{
                    model: CatalogModel,
                    include: [{
                        model: CatalogTypeModel,
                    }],
                }],
            }],

        })
        if (result) {
            // to get only one catalog_type for product
            // result.catalog.catalog_types.length = 1
            res.status(200).send({
                message: "search result",
                product_type: result,
            });
        } else {
            res.status(400).send({
                message: "product not found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error Occured while searching for product type',
            error: error
        })
    }
}

// ---------------------(Update Product-Type Work)---------------------
module.exports.updateProductType = async (req, res) => {
    try {
        console.log(req.body)
        const result = await ProductTypeModel.update(req.body, {
            where: {
                product_type_id: req.params.pId
            }
        });
        console.log(result);
        if (result) {
            const find = await ProductTypeModel.findByPk(req.params.pId, {
                include: [{
                    model: ProductModel,
                }],
            })
            res.status(200).send({
                message: "update result",
                updated_result: find
            });
        } else {
            res.status(400).send({
                message: "product not found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error Occured while updating product type',
            error: error
        })
    }
}

// ---------------------(Remove Product-Type Work)---------------------
module.exports.removeProductType = async (req, res) => {
    try {
        const find = await ProductTypeModel.findByPk(req.params.pId)
        if (!find) {
            return res.status(400).send({
                message: "The product-type you want to update is not found, please check your data",
                Hint: "Provide valid id"
            })
        }
        const result = await ProductTypeModel.destroy({
            // truncate: true, //this will empty all table
            // cascade: true, // this will help above command to deleted that data also which i reffering to its id primary key
            // restartIdentity: true, // this will help above truncate command to reset the promary key

            where: {
                product_type_id: req.params.pId
            }
        })
        if (result) {
            res.status(200).send({
                message: "product type removed successfully",
            });
        } else {
            res.status(400).send({
                message: "product type not found",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "error occured while deleting product",
            error: error,
        });
    }
} 