const express = require('express');
const router = express.Router();
const {
    create,
    categoryById,
    read,
    update,
    remove,
    list
} = require('../controllers/categoryController');
const {
    requireSignin,
    isAuth,
    isAdmin
} = require('../controllers/authController');
const {
    userById
} = require('../controllers/userController');

router.param('userId', userById);
router.param('categoryId', categoryById);



router.get("/category/:categoryId", read);
router.post("/category/create/:userId", requireSignin, isAdmin, isAuth, create);
router.put("/category/:categoryId/:userId", requireSignin, isAdmin, isAuth, update);
router.delete("/category/:categoryId/:userId", requireSignin, isAdmin, isAuth, remove);
router.get("/categories", list);
module.exports = router;