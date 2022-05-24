const User  = require('../../models/userModel');
const constants = require('../../constants/constants');
const UserSession = require('../../models/userSession');


/**
 * User Service
 */
class UserService {



  // get user by id
  getUserById = (_id) => User.findOne({ _id, role: { $in: [constants.role.user] } });
  getUserAmount = (_id) => User.findOne({ _id, role: { $in: [constants.role.user] } }).select('Amount walletAmount');
  getUserBySocialLogin = (social_login_id) => User.findOne({ social_login_id, role: { $in: [constants.role.user] } });
  updateUserAmount = (userId, amount) => User.updateOne({id: userId}, { $set: { Amount: amount }})
  updateUserWallet = (userId, walletAmount) => User.updateOne({id: userId}, { $set: { walletAmount }})

  getUsers = () => User.find({isDeleted: false, role: { $in: [constants.role.user] }})

  

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