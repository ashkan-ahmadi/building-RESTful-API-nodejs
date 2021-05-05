const express = require('express')
const app = express()
const morgan = require('morgan')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

app.use(morgan('dev'))
app.use('/products', productRoutes) // it forwards all the /products requests to localhost:3000/products
app.use('/orders', orderRoutes) // it forwards all the /orders requests to localhost:3000/orders

// if you have reached here, it means none of the previous middlewares handled the process
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// This handles the error. If the previous error was 404, it passes 404, if not passes 500
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app