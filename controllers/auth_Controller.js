const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user_Model");
const { validateEmail } = require("../services/validateEmail");
const LoginModel = require("../models/login_Model");

module.exports.allUsers = async (req, res, next) => {
    try {
        const users = await UserModel.findAll()
        res.json(users)
    } catch (error) {
        console.log(error)
        res.status(400).send("Error Occured while fetching user data");
    }
}

// --------------------------( Login user Work)---------------------------------
module.exports.login = async (req, res, next) => {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            error: "Please provide all required fields for this API"
        })
    }
    /**
     * this will return user id or false
     * if user_id returned then it will validate and genrate token
     * otherwise error code will send to client 
     */

    let isfound = await authenticate(req);

    if (isfound) {
        const accessToken = jwt.sign(
            { user_id: isfound },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.JWT_EXPIRES_TIME
            }
        );

        const loginData = {
            user_id: isfound,
            token: accessToken,
        }

        const saveLoginInfo = await LoginModel.create(loginData)
        console.log(saveLoginInfo);
        res.status(202).json({ accessToken, user_id: isfound, message: "Login Successfully" })
    }
    else
        res.status(404).json({ message: "Invalid Data Entered" })
}

async function authenticate(req) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({
        where: { email: email.trim() }
    });

    if (user) {
        console.log(user.password);
        const match = await bcrypt.compare(password, user.password);
        console.log(match)
        if (match) {
            return user.user_id;
        }
    } else {
        return false;
    }

}

// --------------------------( New user Work)---------------------------------
module.exports.signup = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.address || !req.body.username || !req.body.password) {
            return res.status(400).send({
                error: "Please provide all required fields for this API"
            })
        }

        if (!req.file) {
            return res.status(400).send({
                error: "Please upalod image"
            })
        }
        if (!validateEmail(req.body.email)) {
            return res.status(400).send({
                error: "Invalid email address",
                hint: 'example@gmail.com'
            })
        }
    } catch (error) {
        return res.status(400).send({
            error: "required data in not completely provided"
        })
    }
    const { username, email, password, address } = req.body;
    try {
        const find = await UserModel.findAll({
            where: { email: email.trim() }
        })
        if (find.length != 0) {
            return res.status(200).send({
                error: "this email already registered"
            })
        }

        // decrypt passwaro before storing it in database 
        const hashedPass = await bcrypt.hash(password, 5);

        console.log(hashedPass);
        const userData = {
            username: username.trim(),
            email: email.trim(),
            password: hashedPass,
            address: address.trim(),
        }

        userData.photo = `assets/user-images/${req.file.filename}`;

        const userCreated = await UserModel.create(userData);
        console.log(userCreated)
        if (!userCreated) {
            return res.status(401).send({
                message: "Error occured during singup/registration",
            });
        }
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_TIME
        })

        if (userCreated) {
            return res.status(201).json({
                message: "Account successfully created",
                jwtToken: token
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(400).send({
            error: "Error Occured while registration"
        })
    }
}

// --------------------------( Logout user Work)---------------------------------
module.exports.logout = async (req, res, next) => {
    console.log(req.body);
    if (!req.body.email || !req.body.user_id) {
        return res.status(400).send({
            error: "Please provide all required fields for this API"
        })
    }
    try {
        const remove = await LoginModel.destroy({ where: { user_id: isfound } })
        if (remove) {
            res.status(404).json({ message: "Logout Successfully" })
        }
        else {
            res.status(404).json({ message: "email or user_id is not matched with login user data" })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "Error occured during logout" })
    }
}
// --------------------------( test token Work)---------------------------------
module.exports.testToken = async (req, res, next) => {
    res.status(200).send({
        message: "working fine..."
    })
}

