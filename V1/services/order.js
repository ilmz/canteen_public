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
    const order = await Order.find(params).sort({createdAt: -1}).limit(limit).select('items toPay createdAt -user payStatus orderType');
    // .aggregate([{
    //   "$group" : {
    //     "_id": "items._id"
    //   }
    // }]);
    // order.sort({createdAt: -1});

    // const order = await Order.aggregate([
    //   {
    //     $match : params,
    //   },
    //   {
    //     $group : {
    //       _id       : "$items._id",
    //       items     : {$first : "$items"},
    //       toPay     : {$first : "$toPay"},
    //       createdAt : {$first : "$createdAt"},
    //       payStatus : {$first : "$payStatus"},
    //       orderType : {$first : "$orderType"},
    //       documentId : {$first : "$_id"}
    //     }
    //   },
    //   {
    //     $sort : {createdAt: -1}
    //   },
    //   {
    //     $limit : limit
    //   },
    //   {
    //     $project: {
    //       _id : "$documentId",
    //       items : 1, 
    //       toPay : 1, 
    //       createdAt : 1,
    //       payStatus : 1,
    //       orderType: 1
    //     }
    //   }
    // ])

    return order;
  }

  countOrder =  async ({limit, skip}) => {
    return await Order.count().limit(limit).skip(skip)
  }

  getTotalAmountForDateRange = async(from, to, userId) => {
    return await Order.aggregate([
      {
        '$match': {
          'toPay': {
            '$gt': 0
          }, 
          'createdAt': {
            '$gte': new Date(new Date(from).setUTCHours(0, 0, 0, 0)), 
            '$lt': new Date(new Date(to).setUTCHours(23, 59, 59, 999))
          }, 
          'user': userId,
          'items.isRevert' : 0
        }
      }, {
        '$group': {
          '_id': {
            'month': {
              '$month': '$createdAt'
            }
          }, 
          'totalAmount': {
            '$sum': '$toPay'
          },
          "year": {"$first" : {"$year" : "$createdAt"}}
        }
      }, {
        '$project': {
          '_id': 0, 
          'monthId'     : '$_id.month', 
          'year'        : '$year',
          'totalAmount' : '$totalAmount'
        }
      }, {
        '$sort' : {
          'monthId' : -1
        }
      }
    ])
  }
}

module.exports = new OrderService();