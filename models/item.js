const mongoose = require('mongoose')
const validator = require('validator');
const category =  require('./category')
const {MENU_ITEM_TYPES} = require('../constants/constants')

const ItemSchema = new mongoose.Schema({
 
  name: String,
  description: String,
  price: {
    type: Number,
    required: [true, 'A item must have a price']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: category
  },
  
  // image: {
  //   type: Schema.Types.ObjectId,
  //   ref: SCHEMAS.Attachment
  // },
  quantity: {
    type: Number,
    required: [true, 'A item must hava a quantity'],
    default: 0
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

ItemSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'categoryId',
    select: '-__v -createdAt -updatedAt',
  });
  next();
});


const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;