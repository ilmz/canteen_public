const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')

class itemValidations {

    static async getTickets(req, res, next) {
        req.body.token = req.headers.authorization;
        req.body.limit      = req.query.limit;
        req.body.page       = req.query.page;

		let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
            page: Joi.number().optional().default(1),
            limit: Joi.number().optional().default(10),
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async createTicket(req, res, next) {
        req.body.token = req.headers.authorization;
        let schema = Joi.object().keys({
            token       : Joi.string().required().error(new Error("authToken is required")),
            title       : Joi.string().optional().default('null'),
            description : Joi.string().optional(),
            attachmentId: Joi.array().items(
                             Joi.string().required().error(new Error("attachment is required")),
                            ).optional(),
        })
		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async updateTicket(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :     Joi.string().required().error(new Error("authToken is required")),
            ticketId        :     Joi.string().required().error(new Error("ticket Id is required")),
            title           :     Joi.string().optional().default('null'),
            description     :     Joi.string().optional(),
            attachmentId    :     Joi.array().items(
                                        Joi.string().required().error(new Error("attachment is required")),
                                    ).optional(),
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async changeTicketStatus(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :     Joi.string().required().error(new Error("authToken is required")),
            ticketId        :     Joi.string().required().error(new Error("ticket Id is required")),
            status          :     Joi.number().required().allow(1,2,3,4)
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
   
    static async ticketComment(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :     Joi.string().required().error(new Error("authToken is required")),
            ticketId        :     Joi.string().required().error(new Error("ticket Id is required")),
            comment         :     Joi.string().optional().error(new Error("comment should be string"))
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
   
    static async deleteTicket(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token                :          Joi.string().required().error(new Error("authToken is required")),
            ticketId             :          Joi.string().required().error(new Error("ticketId is required"))
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async getTicket(req, res, next) {
        req.body.token  = req.headers.authorization;
        req.body.ticketId = req.query.ticketId
		let schema = Joi.object().keys({
            token             :          Joi.string().required().error(new Error("authToken is required")),
            ticketId          :          Joi.string().required().error(new Error("ticketId is required"))
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

module.exports =  itemValidations