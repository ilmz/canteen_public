const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')

class suggestedProductValidation {

    static async getSuggestedProduct(req, res, next) {
        req.body.token = req.headers.authorization;
        req.body.limit      = req.query.limit;
        req.body.page       = req.query.page;
        req.body.type       = req.query.type;

		let schema = Joi.object().keys({
            token: Joi.string().required().error(new Error("authToken is required")),
            page: Joi.number().optional().default(1),
            limit: Joi.number().optional().default(10),
            type: Joi.number().optional().default(0),
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async createSuggestedProduct(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            name            :          Joi.string().required().error(new Error("name is required")),
            price           :          Joi.number().required().error(new Error("price is required")),
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
    static async updateSuggestedProduct(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token               :          Joi.string().required().error(new Error("authToken is required")),
            name                :          Joi.string().optional().error(new Error("name is required")),
            price               :          Joi.number().optional().error(new Error("price is required")),
            categoryId          :          Joi.string().optional().error(new Error("categoryId is required")), 
            productId           :          Joi.string().required().error(new Error("product Id is required")),
            image               :          Joi.string().optional().error(new Error("image id should be valid"))
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async productStatusChange(req, res, next) {
        req.body.token = req.headers.authorization;

		console.log(req.body);

		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            productId       :          Joi.string().required().error(new Error("itemId is required")),
            productStatus   :          Joi.number().integer().required().error(new Error("product Status is required")).valid(1, 2),
            reason          :          Joi.when("productStatus", { is: 2, then: Joi.string().trim().required(), otherwise: Joi.forbidden() })
            // reason          :          Joi.forbidden()
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async deleteSuggestedProduct(req, res, next) {
        req.body.token = req.headers.authorization;
		let schema = Joi.object().keys({
            token           :          Joi.string().required().error(new Error("authToken is required")),
            productId       :          Joi.string().required().error(new Error("product Id is required")),
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async getSuggestedProductById(req, res, next) {
        req.body.token  = req.headers.authorization;
        req.body.productId = req.query.productId
		let schema = Joi.object().keys({
            token               :          Joi.string().required().error(new Error("authToken is required")),
            productId           :          Joi.string().required().error(new Error("product Id is required"))
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

module.exports =  suggestedProductValidation