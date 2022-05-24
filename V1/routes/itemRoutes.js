const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController')
const itemController =  require('../controllers/itemController')
const itemValidator = require('../validators/itemValidatos')
const commanFunction =  require('../../utils/commonFunctions')
const uploadController =  require('../services/fileUploadService')



router.route('/upload').post(uploadController.uploadUserPhoto, itemController.upload);
router.route('/create').post(itemValidator.createItem, commanFunction.protect, authController.restrictTo(1), itemController.createItem);
router.route('/getItem').get(itemValidator.getItem, commanFunction.protect, itemController.getItem);
router.route('/updateItem').patch(itemValidator.updateItem, commanFunction.protect, authController.restrictTo(1), itemController.updateItem);
router.route('/deleteItem').delete(itemValidator.deleteItem, commanFunction.protect, authController.restrictTo(1), itemController.deleteItem);
router.route('/getItemById').get(itemValidator.getItemById, commanFunction.protect, itemController.getItemById);
router.route('/itemEnableDisable').patch(itemValidator.itemEnableDisable, commanFunction.protect,  authController.restrictTo(1), itemController.itemEnableDisable);

module.exports = router;