const express = require('express')
const app = express()

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

app.use('/products', productRoutes) // it forwards all the /products requests to localhost:3000/products
app.use('/orders', orderRoutes) // it forwards all the /orders requests to localhost:3000/orders

module.exports = app