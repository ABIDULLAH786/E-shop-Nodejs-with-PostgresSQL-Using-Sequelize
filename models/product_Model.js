const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const ProductTypeModel = require("./product_type_Model")
const CatalogTypeModel = require("./catalog_type_Model");
const CatalogModel = require("./catalog_Model");

const ProductModel = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    specification: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    size: {
        type: DataTypes.ENUM({
            values: [
                'S',
                'M',
                'L',
            ]
        }),
        allowNull: false
    },
    color: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    product_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    catalog_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    timestamps: false
});



// realtion with ProductTypeModel
ProductTypeModel.hasMany(ProductModel, {
    foreignKey: "product_type_id",
})
ProductModel.belongsTo(ProductTypeModel, {
    foreignKey: "product_type_id",
})


// realtion with CatalogModel
CatalogModel.hasMany(ProductModel, {
    foreignKey: "catalog_id",
})
ProductModel.belongsTo(CatalogModel, {
    foreignKey: "catalog_id",
})
module.exports = ProductModel