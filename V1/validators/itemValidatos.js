const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')

class itemValidations {

    static async getitem(req, res, next) {
        req.body.token = req.headers.authorization;
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
	
}

module.exports =  itemValidations