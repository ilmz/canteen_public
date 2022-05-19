const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')

class userAuthValidation {

    static async signUp(req, res, next) {
		let schema = Joi.object().keys({
			name					    : Joi.string().optional(),
			email					    : Joi.string().optional().email().trim().lowercase(),
			socialType				    : Joi.string().optional(),
			social_login_id				: Joi.string().optional(),
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

module.exports =  userAuthValidation