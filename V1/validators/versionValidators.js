const Joi =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')
// const JoiEmailExtensions = require('joi-email-extensions')

// Joi = Joi.extend([JoiEmailExtensions])


class versionValidator {

    
    static async getVersion(req, res, next) {
            req.body.type       =  req.query.type;
            req.body.appVersion =  req.query.appVersion;
		let schema = Joi.object().keys({
            type        : Joi.number().required().allow(0,1),
            appVersion  : Joi.string().required()
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
			return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
		}
		if (value)
			next()
	}
    static async createVersion(req, res, next) {

		let schema = Joi.object().keys({
            ios_version     : Joi.string().optional(),
            android_version : Joi.string().optional(),
            ios_appLink     : Joi.string().optional(),
            android_appLink : Joi.string().optional(),
            versionId       : Joi.string().optional(),
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

module.exports =  versionValidator