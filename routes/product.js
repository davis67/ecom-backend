const express = require('express');
const router = express.Router();
const {
    create,
    productById,
    list,
    read,
    update,
    remove,
    photo,
    listSearch,
    listBySearch,
    listCategories,
    listRelated
} = require('../controllers/productController');
const {
    requireSignin,
    isAuth,
    isAdmin
} = require('../controllers/authController');

const {
    userById
} = require('../controllers/userController');

router.get("/product/:productId", read);
router.get("/products/search", listSearch);
router.post("/product/create/:userId", requireSignin, isAdmin, isAuth, create);
router.delete("/product/:productId/:userId", requireSignin, isAdmin, isAuth, remove);
router.put("/product/:productId/:userId", requireSignin, isAdmin, isAuth, update);
router.get("/products", list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
// route - make sure its post
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', photo);
router.param('userId', userById);
router.param('productId', productById);



module.exports = router;