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


// catalog routes
app.use(require("./routes/catalogRoutes"))

// Catalog Types routes
app.use(require("./routes/catalogTypeRoutes"))

// Product Types routes
app.use(require("./routes/productTypeRoutes"))

// Product routes
app.use(require("./routes/productRoutes"))

const PORT = process.env.PORT|| 5050
app.listen(PORT,()=>{
    console.log("Servere is running... at port " + PORT)
})