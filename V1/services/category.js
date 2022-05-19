const categoryModel = require('../../models/category')


class categoryService {


  getCategory = async (params) => {
    const items = await categoryModel.find(params,  { skip: 10, limit: 5 });
    return items;
  }
  createCategory = async ( params) => {
    return await categoryModel.create(params);
  }
}

module.exports = new categoryService();