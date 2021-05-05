const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Orders were fetched'
  })
})

router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Order was created'
  })
})

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'You got the order details',
    orderId: req.params.orderId
  })
})


router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted the order',
  })
})

module.exports = router