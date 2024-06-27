const sizeOf = require('image-size')
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
const { isEmpty, isNull }  = require('underscore');
const attachmentService = require('../services/attachment')



class item {
    
    async createItem(req, res) {
        const language = req.headers.lan;
        
        try {
            let { name, description, price, quantity, categoryId, image } = req.body;

            name = name.split(" ").map((subStr) => {
                return subStr[0].toUpperCase() + subStr.slice(1, subStr.length);
            });

            name = name.join(" ");

            let params =  { name, description, price, quantity, categoryId, image}

            let item = await itemService.createItem(params)

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
            const { name, description, price, quantity, categoryId, image, itemId } = req.body;
            const params = { name, description, price, quantity, categoryId, image }

            if(image){
                let ItemDetail = await itemService.getItem({_id:itemId,  isDeleted: false, isActive: true })
                // console.log("ItemDetail:", ItemDetail);
                if(ItemDetail && ItemDetail.image && image != ItemDetail.image._id){
                    let imageDelete =  await attachmentService.deleteImage(ItemDetail.image._id)
                }
            }

            let item = await itemService.updateItem({_id: req.body.itemId }, params)

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
            let user = req.decoded
            console.log("user", user)
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);
            let params = null
            let isActive = null
            if(user.role == 0){
                // isActive = true
                params =   {isDeleted: false}
            }
            else if(user.role == 1){
                params = {isDeleted: false}
                // isActive = 0 || 1
            }
            // console.log("isActive:", isActive);
            let allItems = await itemService.getItems(params)
            let itemCount =  await itemService.countItems({limit, offset, isDeleted: false})
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


    async getItemById(req, res) {
        const language = req.headers.lan;
        try {
            const { itemId } = req.query;
            let ItemDetail = await itemService.getItems({_id:itemId,  isDeleted: false, isActive: true})
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, ItemDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async itemEnableDisable(req, res) {
        const language = req.headers.lan;
        try {
            const user = req.decoded;
            let { isActive, itemId } = req.body;
            let item =  null;
            if (isActive) {
                 item = await itemService.updateItem({_id: itemId }, { isActive: 1, quantity: 1})
               
            }
            else {
                item = await itemService.updateItem({_id: itemId }, { isActive: 0, quantity: 0})
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
    

    async upload(req, res) {
        const language = req.headers.lan;
        // console.log("upload:", req.file)
        try {
            if (!req.file) {
                return commanFunction.uploadError(res);
            }
       
            let minetype = req.file.mimetype.split('/')[1].toLowerCase();

            // console.log("minetype:", minetype);

           let dimension = sizeOf(req.file.path);
            // console.log("dimension:", dimension);

           let {thumbnail, root} = await commanFunction.compressPhoto(req.file.path, req.file);
            // console.log("thumbnail:", thumbnail);


            let imageField = {
                extension: req.file.mimetype.split('/')[1],
                image_url: `/${req.file.path}`,
                thumb_url: thumbnail,
                size: req.file.size,
                height: isNull(dimension) ? null : dimension.height,
                width: isNull(dimension) ? null : dimension.width
            }

            // console.log("imageField:", imageField);
            logger.info(JSON.stringify({ EVENT: "UPLOAD", FILES: req.file, IMAGEFIELDS: imageField }));
            const image =  await attachmentService.create(imageField)
            // console.log("image:", image);

            // const image =  await attachmentService.upsert(imageField, imageField)

            // const image = await models.attachment.upsert(imageField, { returning: true, raw: true });
            let Result = {
                filename: req.file.filename,
                baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`,
                size: req.file.size,
                extension: req.file.mimetype.split('/')[1],
                image_url: `/${req.file.path}`,
                thumb_url: thumbnail,
                id: image._id,
                // type: parseInt(type) ,
                height: isNull(dimension) ? null : dimension.height,
                width: isNull(dimension) ? null : dimension.width
            }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.UPLOAD_SUCCESSFUL, language || 'en'), Success.OK, Result)
        } catch (error) {
            logger.error(JSON.stringify({ EVENT: "Error", ERROR: error.toString(), STACK: error.stack }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.UPLOAD_ERROR, language || 'en'), BadRequest.Conflict);
        }
    }
}
module.exports = new item