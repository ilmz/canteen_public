const mongoose = require('mongoose')
const validator = require('validator');
const category =  require('./category')
const Attachment =  require('./attachment');
const User = require('./userModel');

const SuggestedProductSchema = new mongoose.Schema({
 
  name: String,
  price: {
    type: Number,
    required: [true, 'A item must have a price']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: category
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Attachment,
    default: null
  },
  productStatus: {
    type: Number,
    default: 0
  },
  user:{
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    },
    name : {
      type: String,
      default: ""
    },
    email : {
      type: String,
      default: ""
    }
  },
  reason : {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

SuggestedProductSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'categoryId',
    select: '-__v -createdAt -updatedAt',
  }).populate({
    path: 'image',
    select: '-__v -createdAt -updatedAt',
  });
  next();
});


const SuggestedProduct = mongoose.model('SuggestedProduct', SuggestedProductSchema);

module.exports = SuggestedProduct;