const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSessionsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  ip: {
    type: String,
  },
//   country: {
//     type: String,
//   },
  userAgent: {
    type: String,
  },
  deviceType: {
    type: String,
  },
  // FCM token
  registerToken: {
    type: String,
  },
  logInTime: {
    type: Date,
    default: new Date(),
  },
  logoutTime: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});

const UserSession = mongoose.model('UserSession', userSessionsSchema);

module.exports = UserSession;