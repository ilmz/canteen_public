const Payment = require('../../models/paymentHistory')


class OrderService {

createPaymentHistory = async ( params) => {
    return await Payment.create(params);
  }
  updatePaymentHistory = async (params) => {
    return await Payment.updateOne(match, { $set: params });
  }
  getOnePaymentHistory = async (params) => {
    const Payment = await Payment.findOne(params);
    return Payment;
  }
  getAllPaymentHistory = async (params) => {
    const Payment = await Payment.find(params).sort({createdAt: -1}).select('items toPay  -user');
    // Payment.sort({createdAt: -1});
    return Payment;
  }
  countPaymentHistory =  async ({limit, skip}) => {
    return await Payment.count().limit(limit).skip(skip)
  }
}

module.exports = new OrderService();