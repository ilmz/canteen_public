const mongoose = require('mongoose');
const { Schema } = mongoose;


const attachmentSchema = new Schema({
    // item: {
    //     type: Schema.Types.ObjectId,
    //     // required: true,
    //     index: true,
    //     ref: 'Item',
    // },
    name: String,
    image_url: String,
    thumb_url: String,
    size: Schema.Types.Decimal128,
    extension: String,
    height: Number,
    width: Number

}, {
    timestamps: true,
})


const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;