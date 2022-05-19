const User  = require('../../models/userModel');
const constants = require('../../constants/constants')


/**
 * User Service
 */
class UserService {



  // get user by id
  getUserById = (_id) => User.findOne({ _id, roles: { $in: [constants.role.user] } });
  getUserBySocialLogin = (social_login_id) => User.findOne({ social_login_id, roles: { $in: [constants.role.user] } });

  // get all admins
 

  /**
   * Create User
   * @param {*} params 
   */
  createUser = async ( params) => {
    return await User.create(params);
  }

  //user logout
  logout = async (DB, id, sessionId) => {
    try {
      await UserSessionModel.updateOne({ "_id": sessionId, "user": id }, {
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
}

module.exports = new UserService();