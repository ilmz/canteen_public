const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { Success, BadRequest, role, serverError  }  = require('../../constants/constants') ;
const versionService = require('../services/versionService') 
const { logger } = require('../../logger/logger');
const { isEmpty, isNull }  = require('underscore');
const constant = require('../../constants/constants')



class versionController {
    
    async createVersion(req, res) {
        try {
           let {ios_version, android_version, ios_appLink, android_appLink, versionId} =  req.body
           let versionCreated = null;
           let params = null;
            if(versionId){  
                 versionCreated =  await versionService.updateVersion({_id: versionId}, {ios_version, android_version, ios_appLink, android_appLink})
            }
            else{
                params =  {ios_version, android_version, ios_appLink, android_appLink}
                versionCreated =  await versionService.createVersion(params)
            }
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, 'en'), Success.OK, versionCreated);
        } catch (error) {

            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
   

    async deleteVersion(req, res) {
        try {
            const { versionId } = req.body;

            let version = await versionService.updateVersion({_id: versionId }, {isDeleted :true})
         
            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS,  'en'), Success.OK, version);
        } catch (error) {
            console.log(error);
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }
  

    async getVersion (req, res) {
        try {
            const { type, appVersion } = req.query;
            let version = {}
            let Result = null
            if (type == constant.type.ios_device) {
                version = { ios_version: appVersion }
            } else {
                version = { android_version: appVersion }
            }

            let responseVersion = await versionService.findOneVersion(version)

            if (responseVersion == null) {
                responseVersion = {
                    soft_update: false,
                    force_update: false,
                    android_appLink: process.env.ANDROID_APP_LINK,
                    ios_appLink: process.env.IOS_APP_LINK,
                }

                Result = {responseVersion}
            } else {
                Result = { responseVersion }
            }

            return sendCustomResponse(res, getResponseMessage(responseMessageCode.SUCCESS, 'en'), Success.OK, Result)
        } catch (error) {
            logger.error(JSON.stringify({
                EVENT: "Error",
                ERROR: error.toString()
            }));
        }
    }

   

    
}
module.exports = new versionController;