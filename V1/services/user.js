const User  = require('../../models/userModel');
const constants = require('../../constants/constants');
const UserSession = require('../../models/userSession');


/**
 * User Service
 */
class UserService {



  // get user by id
  getUserById = (_id) => User.findOne({ _id, roles: { $in: [constants.role.user] } });
  getUserBySocialLogin = (social_login_id) => User.findOne({ social_login_id, roles: { $in: [constants.role.user] } });

  

  //UserSession
  findUserSession  = (params) => UserSession.find(params)
  findOneUserSession  = (registerToken) => UserSession.findOne({registerToken, isDeleted: false})
  createSession = (params) => UserSession.create(params)

  updateUsersession = (expiredSessionIds) => UserSession.updateMany({ _id: { $in: expiredSessionIds } }, {
    $set: { isDeleted: true }
  })
  // await UserSessionModel.updateMany({ _id: { $in: expiredSessionIds } }, {
  //   $set: { logoutTime: new Date() }
  // });

 

  /**
   * Create User
   * @param {*} params 
   */
  createUser = async ( params) => {
    return await User.create(params);
  }

  //user logout
  logout = async ( id, sessionId) => {
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