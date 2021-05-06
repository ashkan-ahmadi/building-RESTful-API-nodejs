const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')


const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

mongoose.connect(
  'mongodb+srv://mainUser:' +
  process.env.MONGO_ATLAS_PW +
  '@cluster0.fzcxu.mongodb.net/RESTAPI?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }) // password inside nodemon.json

app.use(morgan('dev'))
app.use(express.json()) // this is to parse the body as json

// This is to avoid CORS errors. This can restrict or allow certain source websites, or certain request types
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,  POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }

  next()
})
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