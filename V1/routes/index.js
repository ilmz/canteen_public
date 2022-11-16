const express = require('express');

const userRoute                =   require('../routes/userRoutes');
const categoryRoute            =   require('../routes/categoryRoutes');
const itemRoute                =   require('../routes/itemRoutes')
const orderRoute               =   require('../routes/orderRoutes')
const ticketRoute              =   require('../routes/ticketRoutes')
const suggestedProductRoute    =   require('../routes/suggestedProduct')
const versionRoute             =   require('../routes/versionRoutes')

const router = express.Router();




router.use('/users'                        ,      userRoute);
router.use('/category'                     ,      categoryRoute);
router.use('/items'                        ,      itemRoute);
router.use('/order'                        ,      orderRoute);
router.use('/ticket'                       ,      ticketRoute);
router.use('/version'                      ,      versionRoute);
router.use('/suggested-product'            ,      suggestedProductRoute);

module.exports = router