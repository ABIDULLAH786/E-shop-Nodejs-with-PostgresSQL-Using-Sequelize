const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user_Model")

module.exports.allUsers = async (req, res, next) => {
    try {
        const users = await UserModel.findAll({})
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(400).send("Error Occured while fetching user data");
    }
}
module.exports.login = async (req, res, next) => {
    /**
     * this will return user id or false
     * if user_id returned then it will validate and genrate token
     * otherwise error code will send to client 
     */

    let isfound = await authenticate(req);
    if (isfound) {
        const accessToken = jwt.sign(
            { id: isfound },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.JWT_EXPIRES_TIME
            }
        );

        res.status(202).json({ accessToken, id: isfound, message: "Login Done" })
    }
    else
        res.status(404).json({ message: "Invalid Data Entered" })
}
async function authenticate(req) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email.trim() });
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return user._id;
        }
    } else {
        return false;
    }

}

// --------------------------( New user Work)---------------------------------
module.exports.signup = async (req, res, next) => {
    const { username, email, password, address } = req.body;
    try {
        const find = await UserModel.find({ email: email.trim() })
        if (find.length != 0) {
            return res.status(200).send("user with this email already exist")
        }
        const userData = {
            name: username.trim(),
            email: username.trim(),
            password: password.trim(),
            address: address.trim(),
        }
        userData.photo = `assets/user-images/${req.file.filename}`;
        const userCreated = await UserModel.create(userData);
        if (!userCreated) {
            return res.status(401).send(err);
        }
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_TIME
        })

        if (userCreated) {
            res.status(201).json({
                message: "Account successfully created",
                jwtToken: token
            })
        }
            

    } catch (error) {
        console.log(error)
        res.status(400).send("Error Occured while registration")
    }
}