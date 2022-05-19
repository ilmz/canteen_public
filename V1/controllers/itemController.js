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
    async createItem(req, res) {
        const language = req.headers.lan;
        
        try {
            const { name, description, price, quantity, categoryId } = req.body;

            let item = await itemService.createItem(req.body)

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, item);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }
    async updateItem(req, res) {
        const language = req.headers.lan;

        try {
            const { name, description, price, quantity, categoryId } = req.body;
            const params = { name, description, price, quantity, categoryId }

            let item = await itemService.updateItem({_id: req.body.itemId }, params)

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, item);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }

    async deleteItem(req, res) {
        const language = req.headers.lan;
       
        try {
            const { itemId } = req.body;
            let params =  {isDeleted :true}

            let item = await itemService.updateItem({_id: itemId }, params)
         
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, item);
        } catch (error) {
            console.log(error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async getItem(req, res) {
        const language = req.headers.lan;
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);

            let allItems = await itemService.getItems({isDeleted: false})
            let itemCount =  await itemService.countItems({limit, offset, isDeleted: false})
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

    async getItemById(req, res) {
        const language = req.headers.lan;
        try {
            const { itemId } = req.query;
            let ItemDetail = await itemService.getItems({_id:itemId,  isDeleted: false})
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, ItemDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
}
module.exports = new item