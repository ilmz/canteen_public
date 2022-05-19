const User = require('../../models/userModel');
const constants = require('../../constants/constants')

class AdminService {

    //logout admin
    logout = async (id, sessionId) => {
      try {
        let user = await UserSession.updateOne({ _id: sessionId, user: id }, {
          $set: {
            logoutTime: new Date()
          }
        })
        return "LOGGED_OUT"
      }
      catch (e) {
        return e;
      }
    }
  
    // get user by id
    getAdminById = (_id) => User.findOne({ _id, roles: { $in: [constants.role.admin] } });
  
    /**
     * Check if email exists
     * @param {*} payload 
     */
    getAdminByEmail = (email) => User.findOne({ email: email, roles: { $in: [constants.role.admin] } });
  
    /**
     * Get access role
     * @param {*} adminRole 
     */
    getAccessRole = async (adminRole) => await AccessRole.findOne({ name: adminRole });
  
    /**
     * Create User
     * @param {*} params 
     */
    createAdmin = async (params) => {
      let role = constants.role.admin;
      return await User.create({ ...params, role })
    }
  
   
  }
  
  module.exports = new AdminService();