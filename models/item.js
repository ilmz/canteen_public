const mongoose = require('mongoose')
const validator = require('validator');
const category =  require('./category')
const Attachment =  require('./attachment')

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
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Attachment,
    default: null
  },
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
  }).populate({
    path: 'image',
    select: '-__v -createdAt -updatedAt',
  });
  next();
});


const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;