const Joi  =  require('joi');
const {sendCustomResponse} = require('../../responses/responses')
const { Success, BadRequest }  = require('../../constants/constants') ;
const {logger} =  require('../../logger/logger')


class adminValidator {
    static async login(req, res, next) {
        let schema = Joi.object().keys({
            email           : Joi.string().required().error(new Error("email is required")),
            password        : Joi.string().required().error(new Error("Password is required")),
        });

        const { value, error } = schema.validate(req.body)
        if (error) {
            logger.error(JSON.stringify({ EVENT: "JOI EROOR", Error: error }));
            return sendCustomResponse(res, error.message, BadRequest.INVALID, {})
        }
        if (value)
            next()
    }
   
    
}
module.exports =  adminValidator;