const Order = require('../../models/order')


class OrderService {
createOrder = async ( params) => {
    return await Order.create(params);
  }
  updateOrder = async (match, params) => {
    return await Order.updateOne(match, { $set: params }, {new: true});
  }
  getOrder = async (params) => {
    const order = await Order.findOne(params);
    return order;
  }
  getOrders = async (params) => {
    const order = await Order.find(params).sort({createdAt: -1}).select('items toPay createdAt -user payStatus orderType');
    // order.sort({createdAt: -1});
    return order;
  }
  getLimitedorders = async (limit, params) => {
    const order = await Order.find(params).sort({createdAt: -1}).limit(limit).select('items toPay createdAt -user payStatus orderType').aggregate([{
      "$group" : {
        "_id": "items._id"
      }
    }]);
    // order.sort({createdAt: -1});
    return order;
  }
  countOrder =  async ({limit, skip}) => {
    return await Order.count().limit(limit).skip(skip)
  }
}

module.exports = new OrderService();