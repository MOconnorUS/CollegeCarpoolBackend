const express = require('express')
const router = express.Router()
const { registerUser }  = require('../controllers/accountController')
const { login } = require('../controllers/accountController')
// const { getMe } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', login)
// router.get('/me', protect, getMe)

module.exports = router