
const express = require('express');

const router = express.Router();

const userController =  require('../controllers/userController')
const authUserValidator =  require('../validators/userValidators')
const authController = require('../controllers/authController');
const commanFunction =  require('../../utils/commonFunctions')

const adminValidator =  require('../validators/adminValidators')

router.route('/auth/signUp').post(authUserValidator.signUp, userController.signUp);
router.route('/auth/logout').get(authUserValidator.logout, commanFunction.protect,  userController.logout);
router.route('/auth/getUser').get(authUserValidator.getUser, commanFunction.protect,  userController.getUser);


router.route('/admin/login').post(adminValidator.login, authController.login);
router.route('/admin/logout').get(adminValidator.logout, commanFunction.protect, authController.logout);
router.route('/admin/delete').delete(adminValidator.deleteUser, commanFunction.protect, authController.restrictTo(1), userController.deleteUser);

router.route(`/admin/userlisting`).get(authUserValidator.userListing, commanFunction.protect, authController.restrictTo(1), userController.userListing);

router.use(authController.restrictTo(1));

router.route(`/admin/signup`).post(authUserValidator.signUp, authController.signup);

module.exports = router;