const express = require('express');

const router = express.Router();

const commanFunction =  require('../../utils/commonFunctions')
const versionController =  require('../controllers/versionController')
const versionValidator =  require('../validators/versionValidators')


router.route('/getVersion').get(versionValidator.getVersion, versionController.getVersion);
router.route('/createVersion').post(versionValidator.createVersion, versionController.createVersion);

module.exports = router;