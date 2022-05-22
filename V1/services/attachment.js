const Attachment =  require('../../models/attachment')

class attachmentService {

    upsert = (match, params) => Attachment.findOneAndUpdate(match, { $set: params }, { new: true }, {upsert: true});
    create = (params) => Attachment.create(params);

    
}

module.exports = new attachmentService();