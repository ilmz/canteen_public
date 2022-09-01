const mongoose = require('mongoose');
const { Schema } = mongoose;
const  User  = require('./userModel');
const Item = require('./item')
const category = require('./category')
const { PAYMENT_STATUS, PAYMENT_METHODS, ORDER_TYPES } = require('../constants/constants')


const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User
  },
  items: [
    {
     
      itemId: {
        type: Schema.Types.ObjectId,
        ref: Item
      },
      isRevert: {
        type: Number,
        default: 0
      },
      description: String,
      price: Number,
      quantity: Number,
      
    }
  ],
  
  total: {
    type: Number,
    default: 0
  },
  toPay: {
    type: Number,
    default: 0
  },
  cashPaid: {
    type: Number,
    default: 0
  },
  payStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
  },
  payMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHODS),
    default: PAYMENT_METHODS.OFFLINE
  },
  orderType: {
    type: Number,
    enum: Object.values(ORDER_TYPES),
    default: ORDER_TYPES.PLACED
  }
  // paymentId: {
  //   type: Schema.Types.ObjectId,
  //   ref: SCHEMAS.OrderPayment
  // },
  // declinedReasons: [String],
  
}, {
  timestamps: true
});


orderSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'items.itemId',
  });
  next();
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;