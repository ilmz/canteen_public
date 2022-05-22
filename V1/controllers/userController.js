

const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError  }  = require('../../constants/constants') ;
const UserService  = require('../services/user');
const { logger } = require('../../logger/logger');

class user {
    
    async signUp(req, res) {
        const { language, deviceType } = req.headers;
        try {

            let { name, email, socialType, social_login_id } = req.body;
            const roles = role.user;
            const body = {};
            let result;

            if (!social_login_id)
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.PARAMETER_MISSING_OR_WRONG_PARAMETER, language || 'en'), BadRequest.INVALID);

            socialType.toLowerCase() == 'apple' ? body.appleId = social_login_id : body.googleId = social_login_id;

            const appleId = body.appleId || null;
            const googleId = body.googleId || null;

            const {ip, userAgent}  = await commanFunction.getIP(req);

            let Exist = await UserService.getUserBySocialLogin(social_login_id)
            if (Exist) {
                result = Exist
            }

            else if(!Exist){
                result = await UserService.createUser({ name, email, isSocial: 1, social_type: socialType, social_login_id, role: roles })
                // await UserSessionService 

            }
            let resultDetails = await commanFunction.createSendToken(result, 201, req, res);

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, resultDetails)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SOMETHING_WENT_WRONG, language || 'en'), serverError.Internal_Server_error, { error: error.toString() });
        }
    }

    async getUser(req, res) {
        const language = req.headers.lan;
        try {
            const {userId} =  req.query;
            let User = await UserService.getUserById(userId)
           
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, User)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    logout = async (req, res) => {
        const language = req.headers.lan;
        try {
            res.cookie('jwt', 'loggedOut', {
                expires: new Date(Date.now() + 10 * 1000),
                httpOnly: false,
            });
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, {})
        }
        catch(error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    };
   
}

module.exports = new user;
