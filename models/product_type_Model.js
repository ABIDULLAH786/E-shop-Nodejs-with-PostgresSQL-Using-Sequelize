const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");


const ProductTypeModel = sequelize.define('product_types', {
    product_type_id: {
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

module.exports = ProductTypeModel