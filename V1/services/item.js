const item = require('../../models/item')


class itemService {


  getItems = async (params) => {
    const items = await item.find(params);
    return items ;
  }
  createItem = async ( params) => {
    return await item.create(params);
  }
  countItems =  async ({limit, skip}) => {
    return await item.count().limit(limit).skip(skip)
  }
}

module.exports = new itemService();