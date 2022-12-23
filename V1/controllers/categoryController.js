const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError  }  = require('../../constants/constants') ;
const categoryService = require('../services/category')
const { logger } = require('../../logger/logger');


class category {
    async createCategory(req, res) {
        const language = req.headers.lan;
        try {
            let {name, quantity, image } =  req.body
            let params = {name, quantity, image}
            let category = await categoryService.createCategory(params)
          
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, category);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }
    async updateCategory(req, res) {
        const language = req.headers.lan;
        try {
            let {name, quantity, image } =  req.body
            let params = {name, quantity,image}

            let category = await categoryService.updateCategory({_id: req.body.categoryId}, params)

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, category);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }

    async deleteCategory(req, res) {
        const language = req.headers.lan;
       
        try {
            const { categoryId } = req.body;

            let params = { isDeleted: true }

            let category = await categoryService.updateCategory({ _id: req.body.categoryId }, params)

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, category);
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async getCategories(req, res) {
        const language = req.headers.lan;
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);

            let category = await categoryService.getCategory({isDeleted: false})
            let categoryCount =  await categoryService.countCategory({limit, offset, isDeleted: false})

            let pages = Math.ceil(categoryCount / limit);
            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
            let Rsult = {
                totalCounts: categoryCount, totalPages: pages, loadMoreFlag: loadMoreFlag, category
            }
           
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, Rsult)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async getCategoryById(req, res) {
        const language = req.headers.lan;
        try {
            const { categoryId } = req.body;
            let category = await categoryService.getCategory({_id: categoryId, isDeleted: false})

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, category )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
}
module.exports = new category