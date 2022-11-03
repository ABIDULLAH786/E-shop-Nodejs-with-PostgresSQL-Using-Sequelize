const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const CatalogModel = require("./catalog_Model");


const CatalogTypeModel = sequelize.define('catalog_types', {
    catalog_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    catalog_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});


// realtion with CatalogModel
CatalogModel.hasMany(CatalogTypeModel, {
    foreignKey: "catalog_id",
})
CatalogTypeModel.belongsTo(CatalogModel, {
    foreignKey: "catalog_id",
})
module.exports = CatalogTypeModel