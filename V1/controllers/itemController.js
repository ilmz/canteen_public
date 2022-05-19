const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError  }  = require('../../constants/constants') ;
const itemService = require('../services/item')
const { logger } = require('../../logger/logger');


class item {
    async createitem(req, res) {
        const language = req.headers.lan;
        try {
            const { name, description, price, quantity, categoryId } = req.body;

            let item = await itemService.createItem(req.body)

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, item);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }
    async updateeitem(req, res) {
        const language = req.headers.lan;
        // const transaction = await sequalize.transaction();
        const { regioncode } = req.headers;
        try {
          
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, feedbackComment);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }

    async deleteitem(req, res) {
        const language = req.headers.lan;
       
        try {
            const { user_role_id, user_seller_id, user_driver_id, role } = req.decode;
         
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.THE_FEEDBACK_IS_DELETED, language || 'en'), Success.OK);
        } catch (error) {
            console.log(error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async getitem(req, res) {
        const language = req.headers.lan;
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);

            let allItems = await itemService.getItems({})
            let itemCount =  await itemService.countItems({limit, offset})
            let pages = Math.ceil(itemCount / limit);
            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
            let Rsult = {
                totalCounts: itemCount, totalPages: pages, loadMoreFlag: loadMoreFlag, allItems
            }
           
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Rsult)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async getitemById(req, res) {
        const language = req.headers.lan;
        try {
           
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, feedbackDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
}
module.exports = new item