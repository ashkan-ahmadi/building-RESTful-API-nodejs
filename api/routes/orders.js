const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

router.get('/', (req, res) => {
  Order
    .find()
    .select('_id quantity productId')
    .populate('productId') // this is similar to foreign key. it shows the product's data
    .exec()
    .then(docs => {
      console.log(docs)
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            productId: doc.productId,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: `http://${req.get('host')}/orders/${doc._id}`
            }
          }
        })

      })
    })
    .catch(err => {
      console.error(err),
        res.status(500).json({
          message: "There was an error",
          error: err
        })
    })
})

router.post('/', (req, res) => {
  /* First we need to check if the productId was in the request even exists in the database */
  Product
    .findById(req.body.productId)
    .then(product => {
      if (!product) { // return with 404 message if productId not found
        return res.status(404).json({
          message: 'Product ID not found in the database. Please review the product ID passed and try again.'
        })
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        productId: req.body.productId
      })
      return order.save()
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Order was created',
        success: true,
        ok: true,
        status: 201,
        request: {
          type: 'GET',
          url: `http://${req.get('host')}/orders/${result._id}`
        },
        data: {
          _id: result._id,
          pdocutId: result.productId,
          quantity: result.quantity
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'There was an error',
        error: err
      })
    })
})

router.get('/:orderId', (req, res, next) => {
  Order
    .findById(req.params.orderId)
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'No order with such order number was found.'
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          description: 'You can fetch all the orders by using the url',
          url: `http://${req.get('host')}/orders`
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'There was an error',
        error: err
      })
    })
})


router.delete('/:orderId', (req, res, next) => {
  Order
    .remove({ _id: req.params.orderId })
    .exec()
    .then(response => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          descrption: 'You can add new orders by sending a POST request to the URL using the body',
          url: `http://${req.get('host')}/orders`,
          body: {
            productId: 'objectId & required',
            quantity: 'Number (default: 1)'
          }
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'There was an error',
        error: err
      })
    })
})

module.exports = router