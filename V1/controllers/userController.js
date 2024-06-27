

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
const { isNull } = require('underscore');

class user {
    
    async signUp(req, res) {
        const { language, devicetype } = req.headers;
        try {
            let { name, email, socialType, social_login_id, registerToken, profileId, profileUrl } = req.body;
            let emailArr = email.split("@");
            //Condition for repetition of email id
            //   let emailCheck =   await UserService.getUserByEmail(email)

            if(emailArr[1] != "illuminz.com"){
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.UNAUTHORIZED, 'en'), BadRequest.Unauthorized)
            }
            const roles = role.user;
            const body = {};
            let result;

            if (!social_login_id)
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.PARAMETER_MISSING_OR_WRONG_PARAMETER, language || 'en'), BadRequest.INVALID);

            socialType.toLowerCase() == 'apple' ? body.appleId = social_login_id : body.googleId = social_login_id;

            const appleId = body.appleId || null;
            const googleId = body.googleId || null;

            const {conRemoteAddress, userAgent}  = await commanFunction.getIP(req);
            console.log("ip:", conRemoteAddress);


            let Exist = await UserService.getUserBySocialLogin(email);
            // console.log("Exist:", Exist);

            // if (Exist) {
            //     Exist = await UserService.updateUser(Exist._id, { name, email , profilePic: profileId, profileUrl })
            //     result = Exist
            //     // console.log("result:", result);

            // }
            if(!Exist){
                result = await UserService.createUser({ name, email, isSocial: 1, social_type: socialType, social_login_id, role: roles, profilePic: profileId, profileUrl, firstTimer: 1 })
                // console.log("result:", result);
                // await UserSessionService 

            }else{
                result = Exist
            }

             // Check if any sessions exist with this registration token
            const expiredSessions =  await UserService.findUserSession({ registerToken, isDeleted: false })

            // expired sessions
            if (expiredSessions.length) {
              const expiredSessionIds = expiredSessions.map((expiredSession) => expiredSession._id);
              await UserService.updateUsersession(expiredSessionIds)
              
            }
            let session = {ip: conRemoteAddress, userAgent, deviceType: devicetype, registerToken, user: result._id}
            await UserService.createSession(session)

            let resultDetails = await commanFunction.createSendToken(result, 201, req, res, session);

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, resultDetails)
        } catch (error) {
            console.log("error:", error)
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
            // const {userId} =  req.query;
            let user = req.decoded
            let User = await UserService.getUserById(user._id)

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, User)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

    async deleteUser(req, res) {
        const language = req.headers.lan;

        try {
            const userId = req.body.userId;

            const isUserExits = await UserService.getUserById(userId);

            if(!isUserExits)
            {
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.USER_NOT_FOUND, language || 'en'), BadRequest.INVALID, {});
            }

            await UserService.deleteUser(userId, { isDeleted : true })
            await UserService.deleteUsersession(userId, { isDeleted : true })

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, {})
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
            let user =  req.decoded;
            console.log("user:", user);
            await UserService.updateUsersession(user.sessionDetails._id)
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, {})
        }
        catch(error) {
            console.log("error:", error)
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    };

    userListing = async (req, res) => {
        try {

            let Users = await UserService.getUsers();
            
            let Rsult = {
                baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`,
                Users
            }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, 'en'), Success.OK,  Rsult)
        } catch (error) {
            console.log("error", error);
            logger.error(JSON.stringify({EVENT: "Error", ERROR: error.toString() }))
            
        }
    }
    // getUser = async (req, res) => {
    //     try {
    //         let user = req.decoded
    //         let Users = await UserService.getUsers(user._id)
    //         // let Rsult = {
    //         //     Users
    //         // }

    //         return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, 'en'), Success.OK,  Users)
    //     } catch (error) {
    //         console.log("error", error);
    //         logger.error(JSON.stringify({EVENT: "Error", ERROR: error.toString() }))
            
    //     }
    // }
   
}

module.exports = new user;
