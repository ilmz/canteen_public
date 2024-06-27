const suggestedProduct = require('../../models/suggestedProduct')


class suggestedProductService {

    updateSuggestedProduct = (match, params) => suggestedProduct.findOneAndUpdate(match, { $set: params}, {new: true});
    getSuggestedProducts = async (params) => {
        const items = await suggestedProduct.find(params).sort('name');
        return items;
    }
    getLimitedSuggestedProducts = async (offset, limit, params) => {
        const items = await suggestedProduct.find(params).sort({'updatedAt' : -1}).skip(offset).limit(limit);
        return items;
    }
    getSuggestedProduct = async (params) => {
        const items = await suggestedProduct.findOne(params);
        return items;
    }
    createSuggestedProduct = async (params) => {
        return await suggestedProduct.create(params);
    }
    countSuggestedProduct = async (params) => {
        return await suggestedProduct.count(params)
    }
    deleteSuggestedProduct = (userId) => suggestedProduct.updateMany({"user.userId" : userId}, { $set: {isDeleted : true}}, {new: true});
}

module.exports = new suggestedProductService();