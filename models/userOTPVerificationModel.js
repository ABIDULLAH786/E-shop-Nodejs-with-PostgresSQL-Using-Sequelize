const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const UserModel = require("./user_Model");

const UserOTPVerificationModel = sequelize.define('user_OTP_Verification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    otp: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    timestamps: false
});


// realtion with UserModel
UserModel.hasOne(UserOTPVerificationModel, {
    foreignKey: "user_id",
})
UserOTPVerificationModel.belongsTo(UserModel, {
    foreignKey: "user_id",
})
module.exports = UserOTPVerificationModel