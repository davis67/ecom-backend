const User = require("../models/user");
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); //for authorisation checks
const {
    errorHandler
} = require("../helpers/dbErrorHandler");


exports.signup = (req, res) => {
    console.log(req.body);
    const user = new User(req.body);

    user.save((error, user) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {

    //find the user based on the email
    const {
        email,
        password
    } = req.body;

    User.findOne({
        email
    }, (error, user) => {
        if (error || !user) {
            return res.status(400).json({
                error: "User with that email doesnt exist.Please sign up"
            })
        }

        //if user is found make sure that you match the username and password
        //create the authenticate method in the user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password dont match"
            })
        }
        //generate the signed token with userId and secret
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET_KEY)
        //persist the token as t in the cookie with the expiry date
        res.cookie('t', token, {
            expire: new Date() + 9999
        })
        //return response with the user and the token to the front end
        const {
            _id,
            name,
            email,
            role
        } = user
        return res.json({
            token,
            user: {
                _id,
                email,
                name,
                role
            }
        })
    })

}

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({
        message: "Signout success!"
    })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET_KEY,
    userProperty: 'auth'
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resource! Access denied"
        });
    }

    next();
}