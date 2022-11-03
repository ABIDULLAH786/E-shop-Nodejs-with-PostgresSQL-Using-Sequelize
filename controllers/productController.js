const ProductModel = require("../models/product_Model")
const fs = require("fs");
const ProductTypeModel = require("../models/product_type_Model");
const CatalogTypeModel = require("../models/catalog_type_Model");
const CatalogModel = require("../models/catalog_Model");

module.exports.addNewProducts = async (req, res) => {

    // this first try catch block is to handle the possible error 
    // that may cause by incomplete or incorrect req 
    try {
        if (req.body.length == 0 || req.body.catalog_id.length == 0 || req.body.product_type_id.length == 0) {
            return res.status(400).send({
                error: "request body cannot have missing or empty field",
                hint: "check that the body has the required fields for this API or not"
            });
        }



        // check whether the associated product_type_id and catalog_id exist in respective modules
        // if no thow an error
        const checkProductType = await ProductTypeModel.findByPk(req.body.product_type_id);
        console.log(checkProductType)
        if (checkProductType === null) {
            return res.status(400).send({
                error: "Foreign Key Constraint Error",
                details: "Either the product_type tabel is empty or you are searching for product_type_id which is not exist in product_type table",
                Hint: "Please before inserting Product, insert data in product_type and catalog table"
            })
        }

        const checkCatalog = await CatalogModel.findByPk(req.body.catalog_id);
        console.log(checkCatalog)

        if (checkCatalog === null) {
            return res.status(400).send({
                error: "Foreign Key Constraint Error",
                details: "Either the catalog tabel is empty or you are searching for catalog_id which is not exist in catalog table",
                Hint: "Please before inserting Product, insert data in product_type and catalog table"
            })
        }

        // first check if user selected image or not if not throw an error
        if (!req.file) {
            return res.status(400).send({
                error: "Please select an image",
            });
        }

        // checking of Size value format
        if (req.body.size.toUpperCase() != 'S' && req.body.size.toUpperCase() != 'L' && req.body.size.toUpperCase() != 'M') {
            return res.status(400).send({
                Error: "value is too long for Size",
                Hint: "Use: ['S','M','L'] for small, medium and large respectively."
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: 'Verify your request data, it may be incomplete or incorrec',
            status: 400,
        });
    }

    // this try catch block is for saveing data into database after checks
    try {

        var productData = {
            name: req.body.name,
            specification: req.body.specification,
            size: req.body.size.toUpperCase(),
            color: req.body.color,
            product_type_id: req.body.product_type_id,
            catalog_id: req.body.catalog_id,
        }


        productData.image = `assets/product-images/${req.file.filename}`;
        console.log(productData)
        var createProduct = await ProductModel.create(productData);
        var find = await ProductModel.findOne({
            where: {
                id: createProduct.id
            },
            include: [{
                model: ProductTypeModel,
            }, {
                model: CatalogModel,
                include: [{
                    model: CatalogTypeModel,
                }],
                required: false
            }]
        })

        // to get only one catalog_type for product
        find.catalog.catalog_types.length = 1

        return res.status(200).send({
            message: "New Product Data saved successfully",
            product: find,
        });

    }
    catch (error) {
        fs.unlinkSync(productData.image);
        console.log(error)
        return res.status(400).json({
            error: 'Unable to save new Product data',
            status: 400,
        });
    }
}

// ---------------------(Update Product Work)---------------------
module.exports.updateProductById = async (req, res) => {
    try {
        // first check if user selected image or not if not throw an error
        if (!req.file) {
            return res.status(400).send({
                message: "Please select an image",
            });
        }
        // first check and remove the previous image
        const find = await ProductModel.findByPk(req.params.pId);
        if (!find) {
            return res.status(400).send({
                message: "The Product your are trying to update is not found",
            });
        }

        if (find.image != null) {
            fs.unlinkSync(find.image);
        }

        // product new object
        const productData = {
            name: req.body.name,
            specification: req.body.specification,
            size: req.body.size.toUpperCase(),
            color: req.body.color,
            product_type_id: req.body.product_type_id,
            catalog_id: req.body.catalog_id,
        }

        productData.image = `assets/product-images/${req.file.filename}`;
        const result = await ProductModel.update(productData, {
            where: {
                id: req.params.pId
            }
        })
        if (result) {
            

            const find = await ProductModel.findOne({
                where: {
                    id: req.params.pId
                },
                include: [{
                    model: ProductTypeModel,
                }, {
                    model: CatalogModel,
                    include: [{
                        model: CatalogTypeModel,
                    }],
                    required: false
                }]
            })
            // to get only one catalog_type for product
            find.catalog.catalog_types.length = 1
            res.status(200).send({
                message: "Product updated successfully",
                Product: find,
            });
        } else {
            res.status(400).send({
                message: "Product not found",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "error occured while updating Product",
            error: error,
        });
    }
}

// ---------------------(Get Single Product Work)---------------------
module.exports.getSingleProductById = async (req, res) => {
    try {
        console.log(req.params.pId)
        const result = await ProductModel.findByPk(req.params.pId, {
            include: [{
                model: ProductTypeModel,
            }, {
                model: CatalogModel,
                include: [{
                    model: CatalogTypeModel,
                }],
                required: false
            }]
        });
        console.log(result)
        if (result) {

            // to get only one catalog_type for product
            // result.catalog.catalog_types.length = 1

            res.status(200).send({
                message: "Product",
                Product: result,
            });
        } else {
            res.status(400).send({
                message: "Product not found",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Unable to get Product data',
            status: 400
        });
    }
}


// ---------------------(Get All Products Work)---------------------
module.exports.getAllProductsById = async (req, res) => {
    try {
        const result = await ProductModel.findAll(
            {
                include: [{
                    model: ProductTypeModel,
                }, {
                    model: CatalogModel,
                    include: [
                        {
                            model: CatalogTypeModel,
                        }
                    ]
                }]
            }
        )
        if (result) {
            // to get only one catalog_type for product
            // result.catalog.catalog_types.length = 1
            res.status(200).send({
                message: "search result",
                products: result,
            });
        } else {
            res.status(400).send({
                message: "Product not found",
                user: result,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Unable to get Product',
            status: 400
        });
    }
}

// ---------------------(Remove Product Work)---------------------
module.exports.removeProductById = async (req, res) => {
    try {

        const find = await ProductModel.findByPk(req.params.pId, {
            include: [{
                model: ProductTypeModel,
            }, {
                model: CatalogModel,
                include: [{
                    model: CatalogTypeModel,
                }],
                required: false
            }]
        });
        if (find != null && (find.image != null)) {
            fs.unlinkSync(find.image);
        }
        const result = await ProductModel.destroy({
            // truncate: true, //this will empty all table
            // cascade: true, // this will help above command to deleted that data also which i reffering to its id primary key
            // restartIdentity: true, // this will help above truncate command to reset the promary key
            where: {
                id: req.params.pId
            }
        })
        if (result) {
            res.status(200).send({
                message: "Product removed successfully",
                Product: find,
            });
        } else {
            res.status(400).send({
                message: "Product not found",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "error occured while deleting Product",
            error: error,
        });
    }
}