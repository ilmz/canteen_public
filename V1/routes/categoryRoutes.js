const express = require('express');

const router = express.Router();

const categoryController =  require('../controllers/categoryController')
const authController = require('../controllers/authController')
const commanFunction =  require('../../utils/commonFunctions')
const categoryValidator =  require('../validators/categoryValidator')



// router.route('/create').post(categoryController.createCategory);
router.route('/create').post(categoryValidator.createCategory, commanFunction.protect, authController.restrictTo(1), categoryController.createCategory);
router.route('/getCategories').get(categoryValidator.getCategories, commanFunction.protect, categoryController.getCategories);
router.route('/updateCategory').patch(categoryValidator.updateCategory, commanFunction.protect, authController.restrictTo(1), categoryController.updateCategory);
router.route('/deleteCategory').delete(categoryValidator.deleteCategory, commanFunction.protect, authController.restrictTo(1), categoryController.deleteCategory);
router.route('/getCategoryById').get(categoryValidator.getCategoryById, commanFunction.protect, categoryController.getCategoryById);





module.exports = router;