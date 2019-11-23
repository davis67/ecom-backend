const User = require("../models/user")

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user;
        next();
    })
}

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(res.profile);
};
exports.update = (req, res) => {
    User.findOneAndUpdate({
        _id: req.profile._id
    }, {
        $set: req.body
    }, {
        new: true
    }, (error, user) => {
        if (error) {
            return res.status(400).json({
                error: "You are not allowed to perfom this action"
            });
        }
        user.profile.hashed_password = undefined;
        user.profile.salt = undefined;
        res.json(user);
    })
};