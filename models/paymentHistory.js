const mongoose = require('mongoose');
// const User = require('./userModel');
// const Order = require('./order');

const paymentHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    amount: {
        type: Number,
        default: 0.00
    },
    Paid: {
        type: Boolean,
        default: false,
    },
    OrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null,
    },
    typeOfPayment: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    reverted: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
},  
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
    
)

const paymentHistory = mongoose.model('paymentHistory', paymentHistorySchema)

module.exports = paymentHistory