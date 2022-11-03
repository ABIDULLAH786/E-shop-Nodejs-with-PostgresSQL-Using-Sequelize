const express = require("express");
const bodyParser = require("body-parser");
const app = new express();
const env = require('dotenv');
const cors = require("cors")

env.config({path:"./config/config.env"})
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())

// connection
const sequelize = require("./config/connection");


// users routes
app.use(require("./routes/auth_Routes"))

// catalog routes
app.use(require("./routes/catalog_Routes"))

// Catalog Types routes
app.use(require("./routes/catalogType_Routes"))

// Product Types routes
app.use(require("./routes/productType_Routes"))

// Product routes
app.use(require("./routes/product_Routes"))

const PORT = process.env.PORT || 5050
app.listen(PORT,()=>{
    console.log("Servere is running... at port " + PORT)
})