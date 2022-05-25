const Order = require('../../models/order')


class OrderService {

createOrder = async ( params) => {
    return await Order.create(params);
  }
  updateOrder = async (params) => {
    return await Order.updateOne(match, { $set: params });
  }
  getOrder = async (params) => {
    const order = await Order.findOne(params);
    return order;
  }
  getOrders = async (params) => {
    const order = await Order.find(params).sort({createdAt: -1}).select('items toPay  -user');
    // order.sort({createdAt: -1});
    return order;
  }
  countOrder =  async ({limit, skip}) => {
    return await Order.count().limit(limit).skip(skip)
  }
}

module.exports = new OrderService();