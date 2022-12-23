const mongoose = require('mongoose')
const validator = require('validator');

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

const category = mongoose.model('category', categorySchema);

module.exports = category;