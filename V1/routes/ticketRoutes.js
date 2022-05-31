const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController')
const ticketController =  require('../controllers/ticketController')
const ticketValidator =  require('../validators/ticketValidators')
const commanFunction =  require('../../utils/commonFunctions')
const uploadController =  require('../services/fileUploadService')



router.route('/uploadAttachments').post(uploadController.uploadAttachments, ticketController.uploadImages);
router.route('/createTicket').post(ticketValidator.createTicket, commanFunction.protect, ticketController.createTicket);
router.route('/getTickets').get(ticketValidator.getTickets, commanFunction.protect, ticketController.getTickets);
router.route('/updateTicket').patch(ticketValidator.updateTicket, commanFunction.protect, ticketController.updateTicket);
router.route('/deleteTicket').delete(ticketValidator.deleteTicket, commanFunction.protect,  ticketController.deleteTicket);
router.route('/getTicket').get(ticketValidator.getTicket, commanFunction.protect, ticketController.getTicket);

module.exports = router;