const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')

class itemValidations {

    static async getItem(req, res, next) {
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
    static async createItem(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            name            :          Joi.string().required().error(new Error("name is required")),
            description     :          Joi.string().optional(),
            price           :          Joi.number().required().error(new Error("price is required")),
            quantity        :          Joi.number().required().error(new Error("quantity is required")), 
            categoryId      :          Joi.string().required().error(new Error("categoryId is required")),
            image           :          Joi.string().optional().error(new Error("image is required")) 
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async updateItem(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            name            :          Joi.string().optional().error(new Error("name is required")),
            description     :          Joi.string().optional(),
            price           :          Joi.number().optional().error(new Error("price is required")),
            quantity        :          Joi.number().optional().error(new Error("quantity is required")), 
            categoryId      :          Joi.string().optional().error(new Error("categoryId is required")), 
            itemId          :          Joi.string().required().error(new Error("itemId is required")),
            image           :          Joi.string().optional().error(new Error("image id should be valid"))
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async itemEnableDisable(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            itemId          :          Joi.string().required().error(new Error("itemId is required")),
            isActive        :          Joi.boolean().required().error(new Error("isActive is required")).valid(0, 1)
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async deleteItem(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            itemId          :          Joi.string().required().error(new Error("itemId is required"))
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async getItemById(req, res, next) {
        req.body.token  = req.headers.authorization;
        req.body.itemId = req.query.itemId
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            itemId          :          Joi.string().required().error(new Error("itemId is required"))
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