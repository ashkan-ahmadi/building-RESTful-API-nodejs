const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Handling GET requests to /products'
  })
})

router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Product was created'
  })
})

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId
  if (id === 'special') {
    res.status(200).json({
      message: 'You discovered the special ID',
      id: id
    })
  } else {
    res.status(200).json({
      message: 'You passed an id'
    })
  }
})

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'You have updated the product',
  })
})

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted the product',
  })
})

module.exports = router