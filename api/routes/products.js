const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const mongoose = require('mongoose')

router.get('/', (req, res) => {
  Product
    .find() // no argument fetches all the items in the database
    .select('name price _id') // this returns only the specified items, it won't return the other items like __v
    .exec()
    .then(docs => {
      // console.log(docs)
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `http://${req.get('host')}/products/${doc._id}`,
            }
          }
        })
      }
      res.status(200).json(response) // this will return an array of objects. if there are no items in the database, it will return an empty array
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      })
    })
})

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  })

  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Product was added to the database',
        success: true,
        ok: true,
        status: 201,
        data: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`
          }
        }
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      })
    })


})

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product
    .findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      console.log(doc)
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`
          }
        })
      } else {
        res.status(404).json({ message: 'No item found with that id' })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err })
    })
})

router.patch('/:productId', (req, res, next) => {
  /* Explanation:
  
  The for loop checks for all the objects inside the req.body. It then assigns the value to those keys. You then use these keys and values to PATCH the data.

  To patch, send a PATCH method along with this array of object(s) as json:

  [
    {
        "propName": "price",
        "value": "15.00"
    },
    {
        "propName": "name",
        "value": "Toy Story"
    }
  ]
  
  If you want to change just one information, then remove the other objects.

  The $set inside the object then goes through all the items and changes anything that is specified
  */
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product
    .updateOne({ _id: id }, { $set: updateOps }) // update() is deprecated
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        message: 'Product updated successfully',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`
        }
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      })
    })
})

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product
    .remove({ _id: id })// this means remove any _id that has the value of the id (coming from productId)
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted successfully',
        request: {
          type: 'POST',
          descrption: 'You can add new products by sending a POST request to the url',
          url: 'http://localhost:3000/products',
          body: {
            name: 'string & required',
            price: 'number & required'
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

module.exports = router