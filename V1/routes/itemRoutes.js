const express = require('express');

const router = express.Router();

const itemController =  require('../controllers/itemController')
const itemValidator = require('../validators/itemValidatos')
const commanFunction =  require('../../utils/commonFunctions')



router.route('/create').post(itemController.createitem);
router.route('/getitem').get(itemValidator.getitem, commanFunction.protect, itemController.getitem);





module.exports = router;