const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const UserModel = require("./user_Model");


const LoginModel = sequelize.define('logins', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
   
}, {
    timestamps: false
});


// realtion with UserModel
UserModel.hasOne(LoginModel, {
    foreignKey: "user_id",
})
LoginModel.belongsTo(UserModel, {
    foreignKey: "user_id",
})
module.exports = LoginModel