
const express = require('express');

const router = express.Router();

const userController =  require('../controllers/userController')
const authUserValidator =  require('../validators/userValidators')
const authController = require('../controllers/authController');

const adminValidator =  require('../validators/adminValidators')

router.route('/auth/signUp').post(authUserValidator.signUp, userController.signUp);


// router.use(authController.restrictTo(1));

router.post(`/signup`, authController.signup);

router.route('/login').post(adminValidator.login, authController.login);

module.exports = router;