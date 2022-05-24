const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError, PAYMENT_STATUS  }  = require('../../constants/constants') ;
const OrderService  = require('../services/order');
const UserService  = require('../services/user');
const { logger } = require('../../logger/logger');
const { isNull, isEmpty } = require('underscore');


class Order {
    async createOrder(req, res) {
        const language = req.headers.lan;
        try {
            const user = req.decoded;
            const { items } = req.body
            let userAmount = 0;
            let sum = 0
            userAmount =  await UserService.getUserAmount(user._id);
            console.log("userAmount:", userAmount);
           
            for(let item of items){
               sum  +=  (item.quantity * item.price);
             
            }
            let toPay =  sum
            userAmount.Amount += toPay
            console.log(" userAmount.Amount:",  userAmount.Amount);

           let amountUpdated =  await UserService.updateUserAmount(user._id, userAmount.Amount)
           console.log("amountUpdated:", amountUpdated);
            
            let UserOrder = await OrderService.createOrder({items, user, toPay, payStatus: PAYMENT_STATUS.PENDING})

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

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, orderDetail )
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
            let user =  req.decoded;
            let AmountRemaining = 0;
            let walletAmount = 0
            let {amountPaid, userId} =  req.body
            let userAmount =  await UserService.getUserAmount(userId);
            console.log("userAmount:", userAmount);

            if (userAmount.walletAmount > 0) {
                AmountRemaining = userAmount.Amount - userAmount.walletAmount
                if (AmountRemaining > 0) {
                    walletAmount = 0
                    AmountRemaining = AmountRemaining - amountPaid
                    if(AmountRemaining < 0){
                        walletAmount = Math.abs(AmountRemaining);
                        AmountRemaining = 0
                    }
                }else if(AmountRemaining < 0 ){
                    walletAmount = Math.abs(AmountRemaining)
                    AmountRemaining = 0

                }
            }else if(userAmount.walletAmount = 0){
                console.log("userAmount", userAmount.Amount)
                AmountRemaining = userAmount.Amount - amountPaid
                console.log("AmountRemaining inside:", AmountRemaining);
                if(AmountRemaining<0){
                    walletAmount = userAmount.walletAmount + Math.abs(AmountRemaining);
                    AmountRemaining = 0
                }
            }
            console.log("walletAmount:", walletAmount, "AmountRemaining", AmountRemaining);
          let userDetail =  await UserService.updateUserAmountWallet(userId, walletAmount, AmountRemaining)
            
            // if(AmountRemaining < 0){
              
            //     await UserService.updateUserWallet(user._id, walletAmount)
            // }else{
            //     await UserService.updateUserAmount(user._id, AmountRemaining)
            // }

            // let orderDetail =  await OrderService.getOrders({user: user._id})

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, userDetail )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
}
module.exports = new Order