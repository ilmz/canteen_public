const Joi =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')
// const JoiEmailExtensions = require('joi-email-extensions')

// Joi = Joi.extend([JoiEmailExtensions])


class userAuthValidation {

    static async signUp(req, res, next) {
		let schema = Joi.object().keys({
			name					    : Joi.string().optional(),
			email					    : Joi.string().optional().email().trim().lowercase(),
			socialType				    : Joi.string().optional(),
			social_login_id				: Joi.string().optional(),
            password                    : Joi.string().optional(),
            passwordConfirm             : Joi.string().optional(),
            registerToken               : Joi.string().required(),
            role                        : Joi.number().optional(),
            profileId                   : Joi.string().optional(),
            profileUrl                  : Joi.string().optional(),
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async logout(req, res, next) {
		let schema = Joi.object().keys({
		
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async userListing(req, res, next) {
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
    static async getUser(req, res, next) {
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
	
}

module.exports =  userAuthValidation