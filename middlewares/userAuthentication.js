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
        res.status(401).send("Token not found");
        return;
    }

    // Authenticate token
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (user) {
            next();
        }

    } catch (err) {
        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            res.status(403).send("JSON Web Token is invalid");
        }

        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            res.status(400).send("JSON Web Token is expired");
        }


    }
};

module.exports = authToken;