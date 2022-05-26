const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError, PAYMENT_STATUS, NOTIFICATION_TYPE  }  = require('../../constants/constants') ;
const OrderService  = require('../services/order');
const UserService  = require('../services/user');
const { logger } = require('../../logger/logger');
const { isNull, isEmpty } = require('underscore');
const {notifications} = require('../../notifications/notification')


class Order {
    async createOrder(req, res) {
        const language = req.headers.lan;
        try {
            const user = req.decoded;
            console.log("user:", user);
            const { items } = req.body
            let userAmount = 0;
            let sum = 0
            userAmount = await UserService.getUserAmount(user._id);
            console.log("userAmount:", userAmount);

            for (let item of items) {
                sum += (item.quantity * item.price);

            }
            let toPay = sum
            userAmount.Amount += toPay
            console.log(" userAmount.Amount:", userAmount.Amount);

            let amountUpdated = await UserService.updateUserAmount(user._id, userAmount.Amount)
            console.log("amountUpdated:", amountUpdated);

            let userNotification = {
                ...NOTIFICATION_TYPE.ORDER_PLACED
              };
            let data = {
                items: `${items}`,
                toPay: `${toPay}`
            }

            let UserOrder = await OrderService.createOrder({ items, user, toPay, payStatus: PAYMENT_STATUS.PENDING })

            userNotification.message = userNotification.body.replace('{userName}', user.name)

            let adminDetail = await UserService.getUserByRole()

            let userSession = await UserService.findOneUserSessionById(adminDetail._id)

            if (userSession && UserOrder) {
                notifications(userSession.registerToken, { notification: userNotification, data: data })
            }


            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, UserOrder);
        } catch (error) {
            console.log("error:", error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            // await transaction.rollback();
        }
    }
    async updateeOrder(req, res) {
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

    async deleteOrder(req, res) {
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
    async getOrder(req, res) {
        const language = req.headers.lan;
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);
            let orderSummary =  await OrderService.getOrders()
            let orderCount =  await OrderService.countOrder({limit, offset})
            let pages = Math.ceil(orderCount / limit);
            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
            let Rsult = {
                totalCounts: orderCount, totalPages: pages, loadMoreFlag: loadMoreFlag, orderSummary
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

    async getOrderById(req, res) {
        const language = req.headers.lan;
        try {
           let {orderId} =  req.query;
           let orderDetail =  await OrderService.getOrder({_id: orderId})
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, orderDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async getOrderHistory(req, res) {
        const language = req.headers.lan;
        try {
            let user =  req.decoded;
            
            let orderDetail =  await OrderService.getOrders({user: user._id})
            let userAmount =  await UserService.getUserAmount(user._id);
            // console.log("userAmount:", userAmount);
            let Response = { baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`, orderDetail, Amount: userAmount.Amount, walletAmount: userAmount.walletAmount}

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Response )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async amountCalculations(req, res) {
        const language = req.headers.lan;
        try {
            // let 
            let user = req.decoded;
            let AmountRemaining = 0;
            let walletAmount = 0
            let { amountPaid, userId } = req.body
            let userAmount = await UserService.getUserAmount(userId);
            console.log("userAmount:", userAmount);


            if (userAmount.walletAmount > 0) {
                AmountRemaining = userAmount.Amount - userAmount.walletAmount
                if (AmountRemaining > 0) {
                    walletAmount = 0
                    AmountRemaining = AmountRemaining - amountPaid
                    if (AmountRemaining < 0) {
                        walletAmount = Math.abs(AmountRemaining);
                        AmountRemaining = 0
                    }
                } else if (AmountRemaining < 0) {
                    walletAmount = Math.abs(AmountRemaining) + amountPaid
                    AmountRemaining = 0

                }
            } else if (userAmount.walletAmount == 0) {
                // console.log("userAmount inside else if: ", userAmount.Amount)
                AmountRemaining = userAmount.Amount - amountPaid
                // console.log("AmountRemaining inside:", AmountRemaining);
                if (AmountRemaining < 0) {
                    walletAmount = userAmount.walletAmount + Math.abs(AmountRemaining);
                    AmountRemaining = 0
                }
            }
            let data = { walletAmount: `${walletAmount}`, Amount: `${AmountRemaining}` }
            let userDetail = await UserService.updateUserAmountWallet(userId, walletAmount, AmountRemaining)

            let userNotification = {
                ...NOTIFICATION_TYPE.AMOUNT_UPDATED
            };

            let userSession = await UserService.findOneUserSessionById(userId)
            if (userSession) {
                console.log("userSession:", userSession);
                notifications(userSession.registerToken, { notification: userNotification, data: data })
            }



            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, userDetail)
        } catch (error) {
            console.log("error:", error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
    async deviceTokenTest (req, res){

        // const {title,  body} =  req.body;

        let notification = {
            title: `Amount updated`,
            body  : "amount deleted"
        }
        let deviceToken = 'dfUpjimmYkmEqzMWA3Ol-L:APA91bFq0lum-ZyePSqSjclPCNzl_BEjFUxI2sBsG_Qly47VdB9zCVamsm72cssZ6X4N0FK3sLgBM4SPBIXCIXhqPY8mZW2-Z2WmaH-8tEoLo1ajLD4x7M3sxVnpOBoVSValxf4hnehd'
        notifications(deviceToken, { notification: notification })

    }
}

module.exports = new Order




