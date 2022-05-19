const item = require('../../models/item')


class itemService {

    updateItem = (match, params) => item.findOneAndUpdate(match, { $set: params}, {new: true});
    getItems = async (params) => {
        const items = await item.find(params);
        return items;
    }
    createItem = async (params) => {
        return await item.create(params);
    }
    countItems = async ({ limit, skip, isDeleted }) => {
        return await item.count({isDeleted}).limit(limit).skip(skip)
    }
}

module.exports = new itemService();