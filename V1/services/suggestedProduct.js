const suggestedProduct = require('../../models/suggestedProduct')


class suggestedProductService {

    updateSuggestedProduct = (match, params) => suggestedProduct.findOneAndUpdate(match, { $set: params}, {new: true});
    getSuggestedProducts = async (params) => {
        const items = await suggestedProduct.find(params).sort('name');
        return items;
    }
    getLimitedSuggestedProducts = async (offset, limit, params) => {
        const items = await suggestedProduct.find(params).sort({'createdAt' : -1}).skip(offset).limit(limit);
        return items;
    }
    getSuggestedProduct = async (params) => {
        const items = await suggestedProduct.findOne(params);
        return items;
    }
    createSuggestedProduct = async (params) => {
        return await suggestedProduct.create(params);
    }
    countSuggestedProduct = async ({ limit, skip, isDeleted }) => {
        return await suggestedProduct.count({isDeleted}).limit(limit).skip(skip)
    }
    deleteSuggestedProduct = (userId) => suggestedProduct.updateMany({"user.userId" : userId}, { $set: {isDeleted : true}}, {new: true});
}

module.exports = new suggestedProductService();