const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')

class categoryValidation {

    static async getCategories(req, res, next) {
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
    static async createCategory(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            name            :          Joi.string().required().error(new Error("name is required")),
            quantity        :          Joi.number().required().error(new Error("quantity is required")),
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
    static async updateCategory(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token               :          Joi.string().required().error(new Error("authToken is required")),
            name                :          Joi.string().optional().error(new Error("name is required")),
            quantity            :          Joi.number().optional().error(new Error("quantity is required")), 
            categoryId          :          Joi.string().required().error(new Error("categoryId is required")),
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
    static async deleteCategory(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token               :          Joi.string().required().error(new Error("authToken is required")),
            categoryId          :          Joi.string().required().error(new Error("categoryId is required"))
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async getCategoryById(req, res, next) {
        req.body.token  = req.headers.authorization;
        req.body.categoryId = req.query.categoryId
		let schema = Joi.object().keys({
            token               :          Joi.string().required().error(new Error("authToken is required")),
            categoryId          :          Joi.string().required().error(new Error("categoryId is required"))
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

module.exports =  categoryValidation