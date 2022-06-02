const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError, PAYMENT_STATUS, NOTIFICATION_TYPE, TICKET_STATUS, EMAIL_TYPE  }  = require('../../constants/constants') ;
const { logger } = require('../../logger/logger');
const { isNull, isEmpty } = require('underscore');
const {notifications} = require('../../notifications/notification')
const {sendEmailNotification} =  require ('../../utils/email')
const ticketService = require('../services/ticketSystem')
const UserService = require('../services/user')
const attachmentService = require('../services/attachment')
const sizeOf = require('image-size')


class ticketSystem {
    async createTicket(req, res) {
        const language = req.headers.lan;
        try {
            const user = req.decoded;
            console.log("user:", user);

            const { title, description, attachmentId } = req.body

            let params = { title, description, attachmentId, ticketStatus: TICKET_STATUS.PENDING, user: user._id }

            let ticketDetails = await ticketService.createTicket(params)

            sendEmailNotification(
                { type: EMAIL_TYPE.TICKET_EMAIL, isEmail: true },
                {  email: 'hr@illuminz.com', name: "Bhavana", title, description, ticketStatus: params.ticketStatus, senderName: user.name }
            );

            let userNotification = {
                ...NOTIFICATION_TYPE.TICKET_RAISED
            };

            userNotification.body.replace('{UserName}', user.name)

            let data = {
                title: `${title}`,
                description: `${description}`
            }

            let userSession = await UserService.findOneUserSessionById(user._id)
               let deviceToken = 'cXrob3-bRN-t06HVMrFsKC:APA91bGQ__KNxqCw2nzdwyZ9k8HNPrieCUoCRBfJn3cvn7uH9t3t-jd_3cLXIUNc2ssRTAUU7M6R4Xe43_0AxI5CdWypUM0Lw3zjwh97uqiepOHsvSGvxzzh5L5lB9sZfsU5J1e-TLCt'
            if (userSession) {
                console.log("userSession:", userSession);
                notifications(userSession.registerToken, { notification: userNotification, data: data })
                // notifications(deviceToken, { notification: userNotification, data: data })
            }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, ticketDetails);
        } catch (error) {
            console.log("error:", error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async updateTicket(req, res) {
        const language = req.headers.lan;
        const { regioncode } = req.headers;
        try {
            const { title, description, attachmentId, ticketId } = req.body

            let params = {title, description, attachmentId} 

            let ticketUpdate =  await ticketService.updateTicket(ticketId, params)

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.ACTION_COMPLETE, language || 'en'), Success.OK, ticketUpdate);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async deleteTicket(req, res) {
        const language = req.headers.lan;
       
        try {
            const user = req.decoded;
            const {ticketId} =  req.body;
            let ticketDelete =  await ticketService.updateTicket(ticketId, {isDeleted: true})
         
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK);
        } catch (error) {
            console.log(error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async getTickets(req, res) {
        const language = req.headers.lan;
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);
            let ticketSummary =  await ticketService.getTickets({isDeleted: false, isActive: true})
            let ticketCount =  await ticketService.countTicket({limit, offset, isDeleted: false, isActive: true})
            let pages = Math.ceil(ticketCount / limit);
            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
            let Rsult = {
                totalCounts: ticketCount, totalPages: pages, loadMoreFlag: loadMoreFlag, ticketSummary
            }
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Rsult)
        } catch (error) {
            console.log("err:", error)
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString(),
                ERR: error
            }));
        }
    }

    async getTicket(req, res) {
        const language = req.headers.lan;
        try {
           let {ticketId} =  req.query;
           let ticketDetail =  await ticketService.getTicket({_id: ticketId, isDeleted: false, isActive: true})
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, ticketDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async changeTicketStatus(req, res) {
        const language = req.headers.lan;
        try {
           let {ticketId, status} =  req.body;
           
           let updatedTicket = await ticketService.updateTicket(ticketId, {ticketStatus: status})

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, updatedTicket )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async ticketComment(req, res) {
        const language = req.headers.lan;
        try {
           let user =  req.decoded;
           let {ticketId,  comment} =  req.body;

           let commentObj =  {userId: user._id, comment }
            
           let commentArr =  [];

           commentArr.push(commentObj)

           let updatedTicket = await ticketService.updateTicket(ticketId, {commentArr})

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, updatedTicket )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
 
    async uploadImages(req, res) {
        const language = req.headers.lan;
        // console.log("upload:", req.files)
        try {
            if (!req.files) {
                return commanFunction.uploadError(res);
            }

           let thumbArr  = await commanFunction.compressPhotos(req.files);
            // console.log("thumbArr:", thumbArr);
            let imageFieldArr = []

            req.files.map(async (file, i) => {
                let dimension = sizeOf(file.path);
                
                let imageField = {
                    extension: file.mimetype.split('/')[1],
                    image_url: `/${file.path}`,
                    thumb_url: thumbArr[i],
                    size: file.size,
                    height: isNull(dimension) ? null : dimension.height,
                    width: isNull(dimension) ? null : dimension.width
                }
                imageFieldArr.push(imageField)
            })
          
            console.log("imageField:", imageFieldArr);
            logger.info(JSON.stringify({ EVENT: "UPLOAD", FILES: req.file, IMAGEFIELDS: imageFieldArr }));
            const images =  await attachmentService.insertMany(imageFieldArr)
            // console.log("image:", image);


            let Result = {
                baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`,
                images
            }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.UPLOAD_SUCCESSFUL, language || 'en'), Success.OK, Result)
        } catch (error) {
            console.log("error:", error);
            logger.error(JSON.stringify({ EVENT: "Error", ERROR: error.toString(), STACK: error.stack }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.UPLOAD_ERROR, language || 'en'), BadRequest.Conflict);
        }
    }
    
}

module.exports = new ticketSystem






