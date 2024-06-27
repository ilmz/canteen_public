const User = require('../../models/userModel');
const commanFunction = require('../../utils/commonFunctions')
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest }  = require('../../constants/constants') ;
const AdminService  = require('../services/admin');
const { logger } = require('../../logger/logger');
const UserService  = require('../services/user');

exports.signup = async (req, res, next) => {
  const {language, devicetype } = req.headers;
  const { name, email, password, passwordConfirm, registerToken } = req.body
  try {
    let isExist = await AdminService.getAdminByEmail(email)

    const { conRemoteAddress, userAgent } = await commanFunction.getIP(req);

    if (isExist) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.EMAIL_EXIST, language || 'en'), Success.ACTION_COMPLETE);

    }

    // Check if any sessions exist with this registration token
    const expiredSessions = await UserService.findUserSession({ registerToken, isDeleted: false })

    // expired sessions
    if (expiredSessions.length) {
      const expiredSessionIds = expiredSessions.map((expiredSession) => expiredSession._id);
      await UserService.updateUsersession(expiredSessionIds)

    }
    const newUser = await AdminService.createAdmin({ name, email, password, passwordConfirm });

    let session = { ip: conRemoteAddress, userAgent, deviceType: devicetype, registerToken, user: newUser._id }
    await UserService.createSession(session)

    

    let Result = await commanFunction.createSendToken(newUser, 201, req, res, session);

    return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.CREATED, Result);

  } catch (error) {
    console.log("error:", error);
  }

}

exports.login = catchAsync(async (req, res, next) => {
    const { email, password, registerToken } = req.body;
    const {language, devicetype }  = req.headers;

    const { conRemoteAddress, userAgent } = await commanFunction.getIP(req);

    //1.) Check if email and password exist
    if (!email || !password) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.EMAIL_PASSWORD_REQUIRED, language || 'en'), BadRequest.INVALID);
    }
    //2.) check if user exist and password is correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || (!await user.correctPassword(password, user.password))) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.EMAIL_OR_PASSWORD_WROGN, language || 'en'), BadRequest.Unauthorized);
    }

    // Check if any sessions exist with this registration token
    const expiredSessions = await UserService.findUserSession({ registerToken, isDeleted: false })

    // expired sessions
    if (expiredSessions.length) {
      const expiredSessionIds = expiredSessions.map((expiredSession) => expiredSession._id);
      await UserService.updateUsersession(expiredSessionIds)

    }
    let session = { ip: conRemoteAddress, userAgent,deviceType: devicetype, registerToken, user: user._id }
    await UserService.createSession(session)

    //3.) if everything ok , then send token to client
    let Result = await commanFunction.createSendToken(user, 200, req, res, session);

    return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Result);
  });

  exports.logout = async (req, res) => {
    res.cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    let user =  req.decoded;
    console.log("user:", user);
    await UserService.updateUsersession(user.sessionDetails._id)

    return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, 'en'), Success.OK);
    
  };


exports.restrictTo = (...roles) => {
  
  return (req, res, next) => {
    const language = req.headers.lan;

    if(req.decoded){
      console.log("role", req.decoded.role);
      console.log("roleDecode", req.decoded);
      req.body.role = req.decoded.role
    }
    if (!roles.includes(req.body.role)) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.NOT_ALLOWED, language || 'en'), BadRequest.Unauthorized);
      // next(new AppError('you are not authorised to perform this action', 403));
    }
    next();
  };
};



