const express = require('express');

const router = express.Router();

const categoryController =  require('../controllers/categoryController')



router.route('/create').post(categoryController.createCategory);





module.exports = router;