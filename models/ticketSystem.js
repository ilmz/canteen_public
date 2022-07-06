const mongoose = require('mongoose');
const { Schema } = mongoose;
const  User  = require('./userModel');
const Attachment =  require('./attachment')
const { TICKET_STATUS } = require('../constants/constants');


const ticketSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    title: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    attachmentId: [{
        type: Schema.Types.ObjectId,
        ref: Attachment
    }],
      
    commentArr: [{
        _id: Schema.Types.ObjectId,
       userId: {
        type: Schema.Types.ObjectId,
        ref: User
    },
        comment: String


    }],
    ticketStatus: {
        type: Number,
        enum: Object.values(TICKET_STATUS),
        default: TICKET_STATUS.PENDING

    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true
});

//Virtual populate
// ticketSchema.virtual('attachment', {
//     ref: "Attachment",
//     foreignField: '_id',
//     localField: 'attachmentId',
//   });

const TicketSystem = mongoose.model('TicketSystem', ticketSchema);

module.exports = TicketSystem;