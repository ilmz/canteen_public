const jwt = require('jsonwebtoken')
const {sendCustomResponse} = require('../responses/responses')
const { responseMessageCode }= require('../responses/messageCodes') ;
const { getResponseMessage }= require('../language/multilanguageController') ;
const { Success, BadRequest }  = require('../constants/constants') ;
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User  = require('../models/userModel');


class commanFunction {

    static async jwtIssue(payload) {
        logger.info(JSON.stringify({ EVENT: "REQUEST RECEIVED", REQUEST_BODY: payload }));
        let EXPIRE_IN = payload.admin_id ? config.ADMIN_EXPIRE_IN : config.EXPIRE_IN;
        return await `${jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: EXPIRE_IN })}`;
    }

    static createSendToken = (user, statusCode, req, res) => {
        const token = this.signToken(user._id);

        res.cookie('jwt', token, {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        });

        //Remove the password from the output
        user.password = undefined;

        let Result = {token,  data: {
            user,
        },}
        return Result
      
        // res.status(statusCode).json({
        //     status: 'success',
        //     token,
        //     data: {
        //         user,
        //     },
        // });
    };
    static signToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      };

     static protect = catchAsync(async (req, res, next) => {
        const { language } = req.headers;
        //1. getting token and check if it's there
        let token;
      
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
        ) {
          token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
          token = req.cookies.jwt;
        }
      
        if (!token) {
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.NOT_LOGGED_IN, language || 'en'), BadRequest.Unauthorized)
        }
      
        //2. Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      
        //3. check if user stil exist
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.USER_DOES_NOT_EXIST, language || 'en'), BadRequest.Unauthorized)
        }
      
        //4. check if user changed password after the token was issued
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //   return next(
        //     new AppError('User recently changed password| Please log in again', 401)
        //   );
        // }
        // GRANT ACCESS TO PROTECTED ROUTE
        req.decoded = currentUser;
        next();
      });
}


module.exports = commanFunction