
const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')



class orderValidator {
    static async createOrder(req, res, next) {

        req.body.token = req.headers.authorization;
        let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
            items: Joi.array().items(Joi.object({
                itemId: Joi.string().required().error(new Error("itemId is required")),
                description: Joi.string().optional(),
                price: Joi.number().required().error(new Error("price is required")),
                quantity: Joi.number().required().error(new Error("quantity is required"))

            }))

        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
    
    static async deleteFeedback(req, res, next) {
        req.body.token = req.headers.authorization;
        let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
            feedbackId: Joi.number().required().error(new Error("feedbackId is required")),
        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
    static async feedbackStatusChange(req, res, next) {
        req.body.token = req.headers.authorization;
        let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
            isActive: Joi.number().valid(0, 1).required().error(new Error("status must be 0 or 1")),
            feedbackId: Joi.number().required().error(new Error("feedbackId is required")),
        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
    static async feedbackActionChange(req, res, next) {
        req.body.token = req.headers.authorization;
        let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
            actionTaken: Joi.number().valid(0, 1).required().error(new Error("status must be 0 or 1")),
            feedbackId: Joi.number().required().error(new Error("feedbackId is required")),
        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
    static async getOrder(req, res, next) {
        req.body.token      = req.headers.authorization;
        req.body.limit      = req.query.limit;
        req.body.page       = req.query.page;


        let schema = Joi.object().keys({
            token       : Joi.string().required().error(new Error("authToken is required")),
            page        : Joi.number().optional().default(1),
            limit       : Joi.number().optional().default(10),
        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
    static async getOrderById(req, res, next) {
        req.body.token = req.headers.authorization;
        req.body.orderId = req.query.orderId;


        let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
            orderId: Joi.string().required().error(new Error("order Id is required")),
        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
    static async getOrderHistory(req, res, next) {
        req.body.token = req.headers.authorization;


        let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
    static async amountCalculations(req, res, next) {
        req.body.token = req.headers.authorization;

        let schema = Joi.object().keys({
            token           : Joi.string().required().error(new Error("authToken is required")),
            amountPaid      : Joi.number().required().error(new Error("amountPaid is required")),
            userId          : Joi.string().required().error(new Error("userId is required")),
        })
        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }

}
module.exports =  orderValidator;
