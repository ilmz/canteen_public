const suggestedProduct = require('../../models/suggestedProduct')


class suggestedProductService {

    updateSuggestedProduct = (match, params) => suggestedProduct.findOneAndUpdate(match, { $set: params}, {new: true});
    getSuggestedProducts = async (params) => {
        const items = await suggestedProduct.find(params).sort('name');
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
   
}

module.exports = new suggestedProductService();