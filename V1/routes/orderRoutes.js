const express = require('express');

const router = express.Router();

const commanFunction =  require('../../utils/commonFunctions')
const OrderConrtoller =  require('../controllers/OrderConrtoller')
const orderValidator =  require('../validators/orderValidator')
const authController = require('../controllers/authController')


// adminRouter.route('/usersList').get(adminValidator.userList, commanFunction.authentication, adminController.userDetailsList);
router.route('/place').post(orderValidator.createOrder, commanFunction.protect, OrderConrtoller.createOrder);
router.route('/repeatOrder').post(orderValidator.repeatOrder, commanFunction.protect, OrderConrtoller.repeatOrder);
router.route('/revertItem').post(orderValidator.revertItem, commanFunction.protect, OrderConrtoller.revertItem);
router.route('/list').get(orderValidator.getOrder, commanFunction.protect, authController.restrictTo(1), OrderConrtoller.getOrder);
router.route('/recentOrder').get(orderValidator.recentOrder, commanFunction.protect,  OrderConrtoller.recentOrder);
router.route('/byId').get(orderValidator.getOrderById, commanFunction.protect, OrderConrtoller.getOrderById);
router.route('/userOrder').get(orderValidator.getOrderHistory, commanFunction.protect, OrderConrtoller.getOrderHistory);
router.route('/amountCalculations').patch(orderValidator.amountCalculations, commanFunction.protect, authController.restrictTo(1), OrderConrtoller.amountCalculations);
router.route('/gettransactionHistory').get(orderValidator.gettransactionHistory, commanFunction.protect,  OrderConrtoller.gettransactionHistory);
router.route('/getMonthlyOrderAmount').get(orderValidator.getMonthlyOrderAmount, commanFunction.protect,  OrderConrtoller.getMonthlyOrderAmount);
router.route('/accountDetail').get(orderValidator.accountDetail, commanFunction.protect,  OrderConrtoller.accountDetail);
router.route('/deviceTokenTest').get(OrderConrtoller.deviceTokenTest);
// router.route('/getitem').get(itemController.getitem);





module.exports = router;