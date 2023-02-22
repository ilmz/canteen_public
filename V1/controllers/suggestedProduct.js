const sizeOf = require('image-size')
const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError, productStatuses  }  = require('../../constants/constants') ;
const suggestedProductService = require('../services/suggestedProduct')
const { logger } = require('../../logger/logger');
const { isEmpty, isNull, constant }  = require('underscore');
const attachmentService = require('../services/attachment')



class suggestedProduct {

    async createSuggestedProduct(req, res) {
        const language    = req.headers.lan;
        const userDetails = req.decoded;

        try {
            const { name, price, categoryId, image } = req.body;
            const userObj = 
            {
                userId : userDetails._id,
                name   : userDetails.name,
                email  : userDetails.email
            }

            let item = await suggestedProductService.createSuggestedProduct({ name, price, categoryId, image, user : userObj })

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, item);
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async updateSuggestedProduct(req, res) {
        const language = req.headers.lan;

        try {
            const { name, description, price, categoryId, image, productId } = req.body;

            if(image){
                let ItemDetail = await suggestedProductService.getSuggestedProduct({_id:productId,  isDeleted: false, isActive: true })
                // console.log("ItemDetail:", ItemDetail);
                if(ItemDetail && ItemDetail.image && image != ItemDetail.image._id){
                    let imageDelete =  await attachmentService.deleteImage(ItemDetail.image._id)
                }
            }

            let item = await suggestedProductService.updateSuggestedProduct({_id: productId }, { name, description, price, categoryId, image })

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, item);
        } catch (error) {
            console.log("errror", error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }

    async deleteSuggestedProduct(req, res) {
        const language = req.headers.lan;
       
        try {
            const { productId } = req.body;

            let item = await suggestedProductService.updateSuggestedProduct({_id: productId },  {isDeleted :true})
         
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, item);
        } catch (error) {
            console.log(error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async getSuggestedProduct(req, res) {
        const language = req.headers.lan;

        try {
            let user = req.decoded;

            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let type = parseInt(req.query.type) >= 0 ? [parseInt(req.query.type)] : [productStatuses.approved, productStatuses.rejected];
            let loadMoreFlag = false;
            let offset = limit * (page - 1);
            let params = null
            let isActive = null

            if(user.role == 0){
                // isActive = true
                params =   {isDeleted: false,  isActive: true, quantity: {$ne: 0}, "user.userId" : user._id}
            }
            else if(user.role == 1){
                params = {isDeleted: false, productStatus : {$in: type}}
                // isActive = 0 || 1
            }
            // console.log("isActive:", isActive);
            let allItems = await suggestedProductService.getLimitedSuggestedProducts(offset, limit, params)
            let itemCount =  await suggestedProductService.countSuggestedProduct(params)
            let pages = Math.ceil(itemCount / limit);

            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
            let Rsult = {
                totalCounts: itemCount, totalPages: pages, loadMoreFlag: loadMoreFlag, baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`, allItems
            }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Rsult)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async getSuggestedProductById(req, res) {
        const language = req.headers.lan;
        try {
            const { productId } = req.query;
            let ItemDetail = await suggestedProductService.getSuggestedProduct({_id: productId,  isDeleted: false, isActive: true})
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, ItemDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async productStatusChange(req, res) {
        const language = req.headers.lan;
        try {
            const user = req.decoded;
            let { productStatus, productId, reason } = req.body;
            let item =  null;
            if (productStatus == productStatuses.approved) {
                item = await suggestedProductService.updateSuggestedProduct({_id: productId }, { productStatus: productStatuses.approved})
            }
            else if(productStatus == productStatuses.rejected)
            {
                item = await suggestedProductService.updateSuggestedProduct({_id: productId }, { productStatus: productStatuses.rejected, reason : reason})
            }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, item);
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.NOT_UPDATED, language || 'en'), BadRequest.INVALID, { error: error.toString() });
        }
    }
}
module.exports = new suggestedProduct