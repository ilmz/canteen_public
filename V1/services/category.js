const categoryModel = require('../../models/category')


class categoryService {

    updateCategory = (match, params) => categoryModel.findOneAndUpdate(match, { $set: params }, { new: true });

    getCategory = async (params) => {
        const category = await categoryModel.find(params);
        return category;
    }
    countCategory = async ({ limit, skip, isDeleted }) => {
        return await categoryModel.count({isDeleted}).limit(limit).skip(skip)
    }
    createCategory = async (params) => {
        return await categoryModel.create(params);
    }
}

module.exports = new categoryService();