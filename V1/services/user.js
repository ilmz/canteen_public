const User  = require('../../models/userModel');
const constants = require('../../constants/constants');
const UserSession = require('../../models/userSession');


/**
 * User Service
 */
class UserService {



  // get user by id
  getUserById = (_id) => User.findOne({ _id, role: { $in: [constants.role.user] } }).populate({
    path: 'profilePic',
    select: '-__v -createdAt -updatedAt',
  });;
  getUserByEmail = (email) => User.findOne({ email, role: { $in: [constants.role.user] } })
  getUserAmount = (_id) => User.findOne({ _id, role: { $in: [constants.role.user] } }).select('Amount walletAmount');
  getUserBySocialLogin = (email) => User.findOne({ email, role: { $in: [constants.role.user] } });
  updateUserAmount = (userId, amount, walletAmount) => User.findOneAndUpdate({_id: userId}, { $set: { Amount: amount, walletAmount: walletAmount }}, {new: true})
  updateUser = (userId, params) => User.findOneAndUpdate({_id: userId}, { $set: params }, {new: true})
  updateUserWallet = (userId, walletAmount) => User.updateOne({_id: userId}, { $set: { walletAmount }})
  updateUserAmountWallet = (userId, walletAmount, amount) => User.findOneAndUpdate({_id: userId}, { $set: { walletAmount, Amount: amount }}, {new: true})

  getUsers = () => User.find({isDeleted: false, role: { $in: [constants.role.user] }}).populate({
    path    : 'profilePic',
    select  : '-__v -createdAt -updatedAt',
  }).select('-__v').populate({
    path    :   'paymentHistory',
    select  :   '-id -__v ',
    options :   { sort: { 'createdAt': -1 } } 
  });

  getUserByRole = () => User.findOne({isDeleted: false, role: { $in: [constants.role.admin] }}).populate({
    path: 'profilePic',
    select: '-__v -createdAt -updatedAt',
  }).select('-__v');

  

  //UserSession
  findUserSession  = (params) => UserSession.find(params)
  findOneUserSession  = (registerToken) => UserSession.findOne({registerToken, isDeleted: false})
  findOneUserSessionById  = (userId) => UserSession.findOne({user: userId, isDeleted: false}).select('registerToken')
  createSession = (params) => UserSession.create(params)

  updateUsersession = (expiredSessionIds) => UserSession.updateMany({ _id: { $in: expiredSessionIds } }, {
    $set: { isDeleted: true }
  })
  deleteUsersession = (userId) => UserSession.updateMany({ user: { $eq: userId } }, {
    $set: { isDeleted: true }
  })
  deleteUser = (userId, params) => User.findOneAndUpdate({_id: userId}, { $set: params })
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