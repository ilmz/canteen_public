const mongoose = require('mongoose')
const validator = require('validator');
const Attachment =  require('./attachment')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Category must have a name'],
    },

    quantity: {
        type: Number,
        required: [true, 'A Category must hava a quantity'],
        default: 0
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Attachment,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }

);

categorySchema.pre(/^find/, function (next) {
    this.populate({
      path: 'image',
      select: '-__v -createdAt -updatedAt',
    });
    next();
});

const category = mongoose.model('category', categorySchema);

module.exports = category;