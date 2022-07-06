const version =  require('../../models/version')


class versionService {

    createVersion = async(params, paramsSet) => {
        try {
            return await version.create(params)
        } catch (error) {
            console.log("error:", error);
            throw error

        }
    }

    updateVersion = (param, paramsSet) => {
        try {
            return  version.findOneAndUpdate(param, {$set: paramsSet}, {new: true} )
        } catch (error) {
             throw error;
        }
    }
   
    findVersion = (params, { limit, offset }) => {
        try {
            return version.find(params).limit(limit).skip(offset)

        } catch (error) {
            throw error;
        }
    }
    countVersion = async ({ isDeleted, isActive}) => {
        try {
            return await version.count({isDeleted, isActive})
        } catch (error) {
            throw error;
        }
        
    }

    findOneVersion = async(params) => {
        try {
           return await version.findOne(params).select('_id ios_version android_version ios_appLink android_appLink soft_update force_update ')
        } catch (error) {
            throw error;
        }
    }
   
    

}
module.exports = new versionService();