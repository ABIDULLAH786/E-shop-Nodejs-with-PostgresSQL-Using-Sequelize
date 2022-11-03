const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = (req, res, next) => {
    // Option 1
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer Token

    // Option 2
    // const token = req.header("x-auth-token");

    // If token not found, send error message
    if (!token) {
        res.status(401).send({
            error: "Token not found",
            hint: "Please add token to req header before hiting this API"
        });
        return;
    }

    // Authenticate token
    try {
        const find = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (find) {
            next();
        }

    } catch (error) {
        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            res.status(403).send({
                error: "JSON Web Token is invalid"
            });
        }

        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            res.status(400).send({
                error: "JSON Web Token is expired"
            });
        }


    }
};

module.exports = authToken;