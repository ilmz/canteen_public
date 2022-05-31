const Attachment =  require('../../models/attachment')

class attachmentService {

    upsert = (match, params) => Attachment.findOneAndUpdate(match, { $set: params }, { new: true }, {upsert: true});
    create = (params) => Attachment.create(params);
    insertMany = (params) => Attachment.insertMany(params);
    deleteImage =  (imageId) => Attachment.deleteOne({ _id: imageId})

    
}

module.exports = new attachmentService();