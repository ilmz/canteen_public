const jwt = require('jsonwebtoken')
const {sendCustomResponse} = require('../responses/responses')
const { responseMessageCode }= require('../responses/messageCodes') ;
const { getResponseMessage, LANGUAGES }= require('../language/multilanguageController') ;
const { Success, BadRequest }  = require('../constants/constants') ;
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const UserService  = require('../V1/services/user');
const User  = require('../models/userModel');
const { logger } =  require('../logger/logger')
const { isNull, isEmpty } = require('underscore');
const sharp = require('sharp');
const root =  require('../root')



class commanFunction {

    static async jwtIssue(payload) {
        logger.info(JSON.stringify({ EVENT: "REQUEST RECEIVED", REQUEST_BODY: payload }));
        let EXPIRE_IN = payload.admin_id ? config.ADMIN_EXPIRE_IN : config.EXPIRE_IN;
        return await `${jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: EXPIRE_IN })}`;
    }

    static createSendToken = (user, statusCode, req, res, session ) => {
        const token = this.signToken(user, session);

        res.cookie('jwt', token, {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        });

        //Remove the password from the output
        if(user.password){
            user.password = undefined;

        }

        let Result = {token,   baseUrl: `http://${process.env.NODE_SERVER_HOST}:3000`, data: {
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
    static async getIP(req) {
        const conRemoteAddress = req.connection.remoteAddress || req.headers['x-forwarded-for']
        console.log("req.connection.remoteAddress:", req.connection.remoteAddress);
        const userAgent = req.headers['user-agent'];
        return {conRemoteAddress, userAgent}
    }

    static signToken = (user, session) => {
        return jwt.sign({ user, sesionId: session }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      };

     static uploadError = (res) =>  {
        let response = {
          status: Success.Upload_error,
          message: getResponseMessage(responseMessageCode.UPLOAD_ERROR, LANGUAGES.ENGLISH),
          data: {}
        };
        logger.error(JSON.stringify({ EVENT: "FINAL RESPONSE", RESPONSE: response }));
        res.send(JSON.stringify(response));
      }

      static compressPhoto = async  (path, file) => {
          console.log("root: ", root);
        // const root = `http://${process.env.NODE_SERVER_HOST} `
        

        const thumbnail = `/uploads/thumbnail/${file.fieldname}-${Date.now()}.${file.originalname.split('.').pop()}`
        const s = await sharp(root + "/" + path, { animated: true })
            .resize({ width: 200, }).toFormat('jpeg', 'png', 'gif', 'jpg')
            .toFile(root + thumbnail, function (err, res) {
                if (err) {
                    console.log("error:", err);
                    logger.error(JSON.stringify({ EVENT: "THUMBNAIL", ERROR: err }))
                }
            })
        return {thumbnail, root}
    }
      static compressPhotos = async  (files) => {
        const thumbArr = []
        files.map(async(file, i) => {
          const thumbnail = `/uploads/thumbnail/${file.fieldname}-${Date.now()}.${file.originalname.split('.').pop()}`
          thumbArr.push(thumbnail)
          // console.log("thumbnail:", thumbnail)
          const s = await sharp(root + "/" + file.path, { animated: true })
          .resize({ width: 200, }).toFormat('jpeg', 'png', 'gif', 'jpg')
          .toFile(root + thumbnail, function (err, res) {
              if (err) {
                  console.log("error:", err);
                  logger.error(JSON.stringify({ EVENT: "THUMBNAIL", ERROR: err }))
              }
          })

        })
      
        return thumbArr
    }

     static protect = catchAsync(async (req, res, next) => {
        const { language } = req.headers;
        //1. getting token and check if it's there
        let token;

        console.log("req.cookies", req.cookies);
      
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
        
          const currentUser = await User.findById(decoded.user._id).lean(true);

          console.log("currentUser====", currentUser);
          if (!currentUser) {
              return sendCustomResponse(res, getResponseMessage(responseMessageCode.USER_DOES_NOT_EXIST, language || 'en'), BadRequest.Unauthorized)
          }


        if (decoded.user._id && decoded.sesionId) {
            let sessionDetails = await UserService.findOneUserSession(decoded.sesionId.registerToken)
          
            if (isEmpty(sessionDetails))
                return sendCustomResponse(res, getResponseMessage(responseMessageCode.SESSION_EXPIRED,  'en'), BadRequest.Unauthorized)
                // throw new Error("session expired. Please logout and login again");
            else{
                currentUser.sessionDetails = sessionDetails
            }
        }
          // GRANT ACCESS TO PROTECTED ROUTE
        //   console.log("decoded:", decoded);
        //   console.log("currentUser:", currentUser);
          req.decoded = currentUser;
      
          console.log("Calling Next");
        next();
      });
}


module.exports = commanFunction