const express = require('express')
const router = express.Router()
const { addCar, getCars } = require('../controllers/carController')
const { protect } = require('../middleware/authMiddleware')


router.post('/', addCar)
router.get('/getCars', protect, getCars)

module.exports = router