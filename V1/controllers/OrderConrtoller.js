const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError, PAYMENT_STATUS, NOTIFICATION_TYPE, ORDER_TYPES  }  = require('../../constants/constants') ;
const OrderService  = require('../services/order');
const UserService  = require('../services/user');
const { logger, fileLogger } = require('../../logger/logger');
const { isNull, isEmpty } = require('underscore');
const {notifications} = require('../../notifications/notification')
const paymentService =  require('../services/payment')
const itemService = require('../services/item')


class Order {
    async revertItem(req, res) {
        try {
            fileLogger.info(req);
            const language = req.headers.lan;
            let { items, orderId } =  req.body;
            const user = req.decoded;
            let sum = 0
            let itemDetails = null;
            let sameItems = [];
            let orderDetails =  await OrderService.getOrder({_id: orderId})
            // console.log("orderDetails:", orderDetails);
            for (let item of items) {
                itemDetails = await itemService.getItem({ _id: item.itemId })
                sum += (item.quantity * item.price);
                if(orderDetails){
                    for(let orderItem of orderDetails.items){
                        // console.log("orderItem.itemId:", orderItem.itemId._id)
                        // console.log("item.itemId:", item.itemId)
                        if(item.itemId == orderItem.itemId._id.valueOf()){
                            const updatedItemQuantity = itemDetails.quantity + item.quantity;
                            await itemService.updateItem({ _id: item.itemId }, { quantity: updatedItemQuantity, isActive: true})

                            sameItems.push(item.itemId)
                            item.isRevert = 1;
                        }
    
                    }

                }
             
              
                 /** comment the item count */
                // itemDetails.quantity = itemDetails.quantity + item.quantity
                // await itemService.updateItem({ _id: item.itemId }, { quantity: itemDetails.quantity })
            }
            // console.log("items details: ", items);
            // for(let sameItem of sameItems){
              let updatedOrder =   await OrderService.updateOrder({_id: orderId, 'items.itemId': { $in: sameItems }}, {'items.$.isRevert': 1})
            // }
        //    console.log("updatedOrder:", updatedOrder);

            let userAmount = await UserService.getUserAmount(user._id);
            let todeduct = sum;

            userAmount.Amount -= todeduct;
            if(userAmount.Amount < 0){
                userAmount.Amount = 0
            }
            let amountUpdated = await UserService.updateUserAmount(user._id, userAmount.Amount)

            let userNotification = {
                ...NOTIFICATION_TYPE.ORDER_REVERTED
            };
            let data = {
                items   : `${items}`,
                todeduct: `${todeduct}`
            }

            let UserOrderReverted = await OrderService.createOrder({ items, user, toPay: todeduct, payStatus: PAYMENT_STATUS.REVERTED, orderType: ORDER_TYPES.REVERTED })

            let paymentHistory =  await paymentService.createPaymentHistory({user: user._id, amount: todeduct, Paid: 1, OrderId: UserOrderReverted._id, reverted: 1})

            userNotification.message = userNotification.body.replace('{userName}', user.name)

            let adminDetail = await UserService.getUserByRole()

            let userSession = await UserService.findOneUserSessionById(adminDetail._id)

            if (userSession && UserOrderReverted) {
                notifications(userSession.registerToken, { notification: userNotification, data: data })
            }

            // 62d8fea9a3be149945a45be7

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, 'en'), Success.OK, UserOrderReverted)
        } catch (error) {
            console.log("error:", error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async repeatOrder(req, res) {
        try {
            const language = req.headers.lan;
            const user = req.decoded;
            // console.log("user:", user);
            const { orderId } = req.body
            let userAmount = 0;
            let itemFilterArr = []
            let sum = 0
            let toPay = 0;
            userAmount = await UserService.getUserAmount(user._id);
            let orderDetails =  await OrderService.getOrder({_id: orderId})
            if(isNull(orderDetails)){
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.WRONG_ORDER_ID,  'en'), Success.OK);
            }

            console.log("userAmount:", orderDetails);
          
            if(orderDetails){
                toPay = orderDetails.toPay
                userAmount.Amount += toPay

            }
           
            //wallet Amount 
            if( userAmount.walletAmount > 0){
                userAmount.Amount = userAmount.Amount - userAmount.walletAmount
                if(userAmount.Amount < 0){
                    userAmount.Amount = 0;
                    userAmount.walletAmount = Math.abs(userAmount.Amount)
                }else if(userAmount.Amount > 0){
                    userAmount.walletAmount = 0
                }else if(userAmount.Amount == 0){
                    userAmount.walletAmount = 0
                }
            }
           
            // console.log(" userAmount.Amount:", userAmount.Amount);

            await UserService.updateUserAmount(user._id, userAmount.Amount,  userAmount.walletAmount)
            // console.log("amountUpdated:", amountUpdated);

            let userNotification = {
                ...NOTIFICATION_TYPE.ORDER_PLACED
              };
            let data = {
                items: `${orderDetails.items}`,
                toPay: `${toPay}`
            }
            if(orderDetails.items.length > 0 && toPay > 0){
                let UserOrder = await OrderService.createOrder({ items: orderDetails.items, user, toPay, payStatus: PAYMENT_STATUS.PENDING })

                let paymentHistory =  await paymentService.createPaymentHistory({user: user._id, amount: toPay, Paid: 0, OrderId: UserOrder._id})
    
                userNotification.message = userNotification.body.replace('{userName}', user.name)
    
                let adminDetail = await UserService.getUserByRole()
    
                let userSession = await UserService.findOneUserSessionById(adminDetail._id)
    
                if (userSession && UserOrder) {
                    notifications(userSession.registerToken, { notification: userNotification, data: data })
                }
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, UserOrder);
            }else{
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.LESS_QUANTITY_LEFT,  'en'), Success.OK);
            }


        } catch (error) {
            console.log("error:", error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async createOrder(req, res) {
        const language = req.headers.lan;
        try {
            const user = req.decoded;
            // console.log("user:", user);
            const { items } = req.body
            let userAmount = 0;
            let itemFilterArr = []
            let itemQuantity = 0;
            let itemDetails = null;
            let sum = 0
            userAmount = await UserService.getUserAmount(user._id);
            // console.log("userAmount:", userAmount);
          

            for (let item of items) {
                
                itemDetails = await itemService.getItem({ _id: item.itemId, isDeleted: false, isActive: true })

                console.log(itemDetails);

                if(!itemDetails)
                {
                    return sendCustomResponse(res, getResponseMessage(responseMessageCode.CANNOT_PLACE_ORDER, language || 'en'), BadRequest.NotFound, {});
                }

                if (itemDetails.quantity >= item.quantity) {
                    itemFilterArr.push(item)
                    sum += (item.quantity * item.price);
                    /** comment the item count */

                    const updatedItemQuantity = itemDetails.quantity - item.quantity < 0 ? 0 : itemDetails.quantity - item.quantity;
                    await itemService.updateItem({ _id: item.itemId }, { quantity: updatedItemQuantity, isActive: updatedItemQuantity ? true : false})
                }
                // else {
                //     getResponseMessage(responseMessageCode.LESS_QUANTITY_LEFT, 'en').replace('{quantity}', itemDetails.quantity)
                // }

            }
            console.log("itemFilterArr:", itemFilterArr);
           
            let toPay = sum
            userAmount.Amount += toPay
            //wallet Amount 
            if( userAmount.walletAmount > 0){
                userAmount.Amount = userAmount.Amount - userAmount.walletAmount
                if(userAmount.Amount < 0){
                    userAmount.Amount = 0;
                    userAmount.walletAmount = Math.abs(userAmount.Amount)
                }else if(userAmount.Amount > 0){
                    userAmount.walletAmount = 0
                }else if(userAmount.Amount == 0){
                    userAmount.walletAmount = 0
                }
            }
           
            // console.log(" userAmount.Amount:", userAmount.Amount);

            let amountUpdated = await UserService.updateUserAmount(user._id, userAmount.Amount,  userAmount.walletAmount)
            // console.log("amountUpdated:", amountUpdated);

            let userNotification = {
                ...NOTIFICATION_TYPE.ORDER_PLACED
              };
            let data = {
                items: `${itemFilterArr}`,
                toPay: `${toPay}`
            }
            if(itemFilterArr.length > 0 && toPay > 0){
                let UserOrder = await OrderService.createOrder({ items: itemFilterArr, user, toPay, payStatus: PAYMENT_STATUS.PENDING })

                let paymentHistory =  await paymentService.createPaymentHistory({user: user._id, amount: toPay, Paid: 0, OrderId: UserOrder._id})
    
                userNotification.message = userNotification.body.replace('{userName}', user.name)
    
                let adminDetail = await UserService.getUserByRole()
    
                let userSession = await UserService.findOneUserSessionById(adminDetail._id)
    
                if (userSession && UserOrder) {
                    notifications(userSession.registerToken, { notification: userNotification, data: data })
                }
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, UserOrder);
            }else{
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.LESS_QUANTITY_LEFT,  'en'), Success.OK);
            }

           
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

    async recentOrder(req, res) {
        const language = req.headers.lan;
        const user = req.decoded;
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);
            let recentOrder =  await OrderService.getLimitedorders(limit, {user: user._id,  orderType: ORDER_TYPES.PLACED, 'items.isRevert' : 0})

            let orderCount =  await OrderService.countOrder({limit, offset})
            let pages = Math.ceil(orderCount / limit);
            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
            let Rsult = {
                totalCounts: orderCount, totalPages: pages, loadMoreFlag: loadMoreFlag, recentOrder
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

    async getMonthlyOrderAmount(req, res) {
        const language = req.headers.lan;

        try {
            const user   = req.decoded;
            const userId = user._id;
            const {from, to} = req.body;

            if(from > to)
            {
                throw new Error("From Date can't be larger than To Date");
            }

            const totalAmountOrders  = await OrderService.getTotalAmountForDateRange(from, to, userId);

            const response = { baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`, orderDetail: totalAmountOrders }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, response)
        }
        catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async getOrderHistory(req, res) {
        const language = req.headers.lan;

        try {
            let user         = req.decoded;
            let limit        = parseInt(req.query.limit) || 10;
            let page         = parseInt(req.query.page)  || 1;
            let loadMoreFlag = false;
            let offset       = limit * (page - 1);
            let from         = req.body.from;
            let to           = req.body.to;
            let params       = {createdAt : {$gte : from, $lt : new Date(new Date(to).setUTCHours(23, 59, 59, 999))}};

            let recentOrder  = await OrderService.getOrders({user: user._id, ...params })
            let orderCount   = await OrderService.countOrder({limit, offset})
            let pages        = Math.ceil(orderCount / limit);

            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }

            let result = {
                totalCounts  : orderCount, 
                totalPages   : pages,
                loadMoreFlag : loadMoreFlag,
                recentOrder
            }

            let paymentHistory = await paymentService.getAllPaymentHistory({user: user._id, Paid: true, isActive: true, isDeleted: false})
            let userAmount     = await UserService.getUserAmount(user._id);
            let Response       = { baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`, orderDetail: result, PaidHistory: paymentHistory, Amount: userAmount.Amount, walletAmount: userAmount.walletAmount}

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Response )
        }
        catch (error) {
            logger.error(JSON.stringify({
                EVENT : "Error",
                ERROR : error.toString()
            }));
        }
    }

    async gettransactionHistory(req, res) {
        const language = req.headers.lan;
        try {
            let user =  req.decoded;
            
            

            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let loadMoreFlag = false;
            let offset = limit * (page - 1);
            let paymentHistory = await paymentService.getAllPaymentHistory({user: user._id, isActive: true, isDeleted: false, Paid: true, reverted: false})
            let historyCount =  await paymentService.countPaymentHistory({limit, offset})
            let pages = Math.ceil(historyCount / limit);
            if ((pages - page) > 0) {
                loadMoreFlag = true;
            }
            let result = {
                totalCounts: historyCount, totalPages: pages, loadMoreFlag: loadMoreFlag, paymentHistory
            }

            // console.log("paymentHistory:", paymentHistory);
            let userAmount =  await UserService.getUserAmount(user._id);
            // console.log("userAmount:", userAmount);
            let Response = { baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`, PaidHistory: result, Amount: userAmount.Amount, walletAmount: userAmount.walletAmount}

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Response )
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async accountDetail(req, res) {
        const language = req.headers.lan;
        try {
            let user =  req.decoded;
            
            let paymentHistory = await paymentService.getAllPaymentHistory({user: user._id, Paid: false, isActive: true,  isDeleted: false})
            let totalSpend = 0;
            for(let payment of paymentHistory){
                totalSpend += payment.amount
            }
            // console.log("paymentHistory:", paymentHistory);
            let userAmount =  await UserService.getUserAmount(user._id);
            // console.log("userAmount:", userAmount);
            let Response = { baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`, totalSpend, Amount: userAmount.Amount, walletAmount: userAmount.walletAmount}

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

            let paymentHistory =  await paymentService.createPaymentHistory({user: userId, amount: amountPaid, Paid: 1})
            //let updatedOrder =   await OrderService.updateOrder({'user': userId, 'payStatus': 'pending'}, {'payStatus': 'paid'});

            let userNotification = {
                ...NOTIFICATION_TYPE.AMOUNT_UPDATED
            };

            let userSession = await UserService.findOneUserSessionById(userId)
            //    let deviceToken = 'cXrob3-bRN-t06HVMrFsKC:APA91bGQ__KNxqCw2nzdwyZ9k8HNPrieCUoCRBfJn3cvn7uH9t3t-jd_3cLXIUNc2ssRTAUU7M6R4Xe43_0AxI5CdWypUM0Lw3zjwh97uqiepOHsvSGvxzzh5L5lB9sZfsU5J1e-TLCt'
            if (userSession) {
                console.log("userSession:", userSession);
                notifications(userSession.registerToken, { notification: userNotification, data: data })
                // notifications(deviceToken, { notification: userNotification, data: data })
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
        let deviceToken = 'cXrob3-bRN-t06HVMrFsKC:APA91bGQ__KNxqCw2nzdwyZ9k8HNPrieCUoCRBfJn3cvn7uH9t3t-jd_3cLXIUNc2ssRTAUU7M6R4Xe43_0AxI5CdWypUM0Lw3zjwh97uqiepOHsvSGvxzzh5L5lB9sZfsU5J1e-TLCt'
        notifications(deviceToken, { notification: notification })

    }
}

module.exports = new Order






