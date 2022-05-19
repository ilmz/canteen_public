const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController')
const itemController =  require('../controllers/itemController')
const itemValidator = require('../validators/itemValidatos')
const commanFunction =  require('../../utils/commonFunctions')



router.route('/create').post(itemValidator.createItem, commanFunction.protect, authController.restrictTo(1), itemController.createItem);
router.route('/getItem').get(itemValidator.getItem, commanFunction.protect, itemController.getItem);
router.route('/updateItem').patch(itemValidator.updateItem, commanFunction.protect, authController.restrictTo(1), itemController.updateItem);
router.route('/deleteItem').delete(itemValidator.deleteItem, commanFunction.protect, authController.restrictTo(1), itemController.deleteItem);
router.route('/getItemById').get(itemValidator.getItemById, commanFunction.protect, itemController.getItemById);

module.exports = router;