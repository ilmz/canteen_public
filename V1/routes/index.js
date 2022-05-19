const express = require('express');

const userRoute =  require('../routes/userRoutes');
const categoryRoute = require('../routes/categoryRoutes');
const itemRoute = require('../routes/itemRoutes')
const orderRoute = require('../routes/orderRoutes')

const router = express.Router();




router.use('/users'         ,      userRoute);
router.use('/category'      ,      categoryRoute);
router.use('/items'         ,      itemRoute);
router.use('/order'         ,      orderRoute);

module.exports = router