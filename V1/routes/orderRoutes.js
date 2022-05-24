const express = require('express');

const router = express.Router();

const commanFunction =  require('../../utils/commonFunctions')
const OrderConrtoller =  require('../controllers/OrderConrtoller')
const orderValidator =  require('../validators/orderValidator')
const authController = require('../controllers/authController')


// adminRouter.route('/usersList').get(adminValidator.userList, commanFunction.authentication, adminController.userDetailsList);
router.route('/place').post(orderValidator.createOrder, commanFunction.protect, OrderConrtoller.createOrder);
router.route('/list').get(orderValidator.getOrder, commanFunction.protect, authController.restrictTo(1), OrderConrtoller.getOrder);
router.route('/byId').get(orderValidator.getOrderById, commanFunction.protect, OrderConrtoller.getOrderById);
router.route('/userOrder').get(orderValidator.getOrderHistory, commanFunction.protect, OrderConrtoller.getOrderHistory);
router.route('/amountCalculations').patch(orderValidator.amountCalculations, commanFunction.protect, authController.restrictTo(1), OrderConrtoller.amountCalculations);
// router.route('/getitem').get(itemController.getitem);





module.exports = router;