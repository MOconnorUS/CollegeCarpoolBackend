const express = require('express')
const router = express.Router()
const { addCar, getCars, removeCar } = require('../controllers/carController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', addCar)
router.get('/getCars', getCars)
router.delete('/removeCar/:id', removeCar)

module.exports = router