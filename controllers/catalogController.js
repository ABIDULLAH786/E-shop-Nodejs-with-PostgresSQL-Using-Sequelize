const CatalogModel = require("../models/catalog_Model");
const CatalogTypeModel = require("../models/catalog_type_Model");
const ProductModel = require("../models/product_Model")


module.exports.createCatalog = async (req, res) => {
    if (req.body.length == 0) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    try {
        console.log(req.body)
        const result = await CatalogModel.create(req.body)
        if (result) {
            res.status(200).send({
                message: "catalog",
                catalog: result,
            });
        } else {
            res.status(400).send({
                message: "catalog can not add",
                catalog: result,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Unable to create new catalog',
            error: error
        })
    }
}

module.exports.getAllCatalogs = async (req, res) => {

    try {
        const result = await CatalogModel.findAll({
            include: [{
                model: CatalogTypeModel,
            },
            {
                model: ProductModel,
            }]
        })
        if (result) {
            res.status(200).send({
                message: "catalogs",
                catalogs: result,
            });
        } else {
            res.status(400).send({
                message: "catalog is empty",
                catalog: result,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error occured while searching catalogs',
            error: error
        })
    }
}

module.exports.getSingleCatalog = async (req, res) => {

    try {
        const checkCatalogType = await ProductModel.findAll();
        if (checkCatalogType) {
            console.log("Product is not empty")
        }
        console.log("Product is empty")
        console.log(req.params.cId)
        const result = await CatalogModel.findByPk(req.params.cId, checkCatalogType && {
            include: [{
                model: CatalogTypeModel,

            }, {
                model: ProductModel,
            }]
        })
        if (result) {
            res.status(200).send({
                message: "search result",
                catalog: result,
            });
        } else {
            res.status(400).send({
                message: "catalog you are searching for not found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error Occured while searching for catalog',
            error: error
        })
    }

}

module.exports.updateCatalog = async (req, res) => {
    if (req.body.length == 0) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    if (!(/^[0-9]+$/.test(req.params.cId))) {
        return res.status(400).send({
            message: "please provide a valid catalog id in query/url",
            Hint: "search query should have only number id, e.g. 1, 23, 302 "
        });
    }
    try {
        const result = await CatalogModel.update(req.body, {
            where: {
                catalog_id: req.params.cId
            }
        });

        if (result != 0) {
            const find = await CatalogModel.findByPk(req.params.cId, {
                include: [{
                    model: CatalogTypeModel,

                }, {
                    model: ProductModel,
                }]
            });
            res.status(200).send({
                message: "catalog update",
                result: find
            });
        } else {
            res.status(400).send({
                message: "catalog can not update",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Unable to update catalog',
            error: error
        })
    }
}

module.exports.removeCatalog = async (req, res) => {
    try {

        const deletedData = await CatalogModel.findByPk(req.params.cId, {
            include: [{
                model: CatalogTypeModel,

            }, {
                model: ProductModel,
            }]
        });

        if (!deletedData) {
            return res.status(200).send({
                Error: "The catalog which you are tryong to removed i not found in system",
                Hint: "Either you enter the wrong catalog id or it does not exist in database"
            });
        }
        const result = await CatalogModel.destroy({
            // truncate: true, //this will empty all table
            // cascade: true, // this will help above command to deleted that data also which i reffering to its id primary key
            // restartIdentity: true, // this will help above truncate command to reset the promary key
            where: {
                catalog_id: req.params.cId
            }
        })
        if (result != 0) {
            return res.status(200).send({
                message: "catalog removed successfully",
                deletedCatalog: deletedData,
            });
        } else {
            res.status(400).send({
                message: "catalog not found",
            });
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "error occured while deleting catalog",
            error: error,
        });
    }
} 