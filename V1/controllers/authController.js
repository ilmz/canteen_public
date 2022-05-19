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

exports.signup = async (req, res, next) => {
  const language = req.headers.lan;
  const { name, email, password, passwordConfirm } = req.body
  try {
    let isExist = await AdminService.getAdminByEmail(email)
    if (isExist) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.EMAIL_EXIST, language || 'en'), Success.ACTION_COMPLETE);
    }
    const newUser = await AdminService.createAdmin({ name, email, password, passwordConfirm });
    
   let Result =  await commanFunction.createSendToken(newUser, 201, req, res);

    return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.CREATED, Result);

  } catch (error) {
    console.log("error:", error);
  }

}

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const language = req.headers.lan;

    //1.) Check if email and password exist
    if (!email || !password) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.EMAIL_PASSWORD_REQUIRED, language || 'en'), BadRequest.INVALID);
    }
    //2.) check if user exist and password is correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || (!await user.correctPassword(password, user.password))) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.EMAIL_OR_PASSWORD_WROGN, language || 'en'), BadRequest.Unauthorized);
    }
    //3.) if everything ok , then send token to client
    let Result = await commanFunction.createSendToken(user, 200, req, res);

    return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK, Result);
  });

  exports.logout = (req, res) => {
    const language = req.headers.lan;
    res.cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: false,
    });
    return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, language || 'en'), Success.OK);
    // res.status(200).json({
    //   status: 'success',
    // });
  };


exports.restrictTo = (...roles) => {
  
  return (req, res, next) => {
    const language = req.headers.lan;

    if(req.decoded){
      req.body.role = req.decoded.role
    }
    if (!roles.includes(req.body.role)) {
      return sendCustomResponse(res, getResponseMessage(responseMessageCode.NOT_ALLOWED, language || 'en'), BadRequest.Unauthorized);
      // next(new AppError('you are not authorised to perform this action', 403));
    }
    next();
  };
};



