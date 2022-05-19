
const express = require('express');

const router = express.Router();

const userController =  require('../controllers/userController')
const authUserValidator =  require('../validators/userValidators')
const authController = require('../controllers/authController');

const adminValidator =  require('../validators/adminValidators')

router.route('/auth/signUp').post(authUserValidator.signUp, userController.signUp);
router.route('/auth/logout').get(authUserValidator.logout, userController.logout);


router.route('/admin/login').post(adminValidator.login, authController.login);
router.route('/admin/logout').get(adminValidator.logout, authController.logout);


router.use(authController.restrictTo(1));

router.route(`/admin/signup`).post(authUserValidator.signUp, authController.signup);
// router.post(`/admin/signup`, authController.signup);

// router.route('/login').post(adminValidator.login, authController.login);

module.exports = router;