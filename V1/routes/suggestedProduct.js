const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController')
const suggestedProduct =  require('../controllers/suggestedProduct')
const suggestedProductValidator = require('../validators/suggestedProduct')
const commanFunction =  require('../../utils/commonFunctions')



router.route('/create').post(suggestedProductValidator.createSuggestedProduct, commanFunction.protect,  suggestedProduct.createSuggestedProduct);
router.route('/getSuggestedProduct').get(suggestedProductValidator.getSuggestedProduct, commanFunction.protect, suggestedProduct.getSuggestedProduct);
router.route('/updateSuggestedProduct').patch(suggestedProductValidator.updateSuggestedProduct, commanFunction.protect,  suggestedProduct.updateSuggestedProduct);
router.route('/deleteSuggestedProduct').delete(suggestedProductValidator.deleteSuggestedProduct, commanFunction.protect, authController.restrictTo(1), suggestedProduct.deleteSuggestedProduct);
router.route('/getSuggestedProductById').get(suggestedProductValidator.getSuggestedProductById, commanFunction.protect, suggestedProduct.getSuggestedProductById);
router.route('/productStatusChange').patch(suggestedProductValidator.productStatusChange, commanFunction.protect,  authController.restrictTo(1), suggestedProduct.productStatusChange);

module.exports = router;