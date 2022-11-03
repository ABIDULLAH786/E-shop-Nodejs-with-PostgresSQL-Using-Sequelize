const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");


const CatalogModel = sequelize.define('catalogs', {
    catalog_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false
});

module.exports = CatalogModel