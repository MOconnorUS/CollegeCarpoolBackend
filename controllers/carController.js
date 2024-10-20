const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Car = require('../models/carModel')

const verified = (token, res) => {
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
        return res.status(403).json({ message: 'Invalid token' });
        }
    });
}

// @desc Add new car
// @route POST /api/car
// @access Public
const addCar = asyncHandler (async (req, res) => {
    const { username, make, model, licensePlate, color, token } = req.body

    if (!make || !model || !licensePlate || !color) {
        return res.status(400).json({ message: 'Please fill out all fields' })
    }

    const carExists = await Car.findOne({username, make, model, licensePlate, color})
    console.log(carExists)

    if (carExists) {
        return res.status(400).json({ message: 'Car is already linked to this account' })
        // throw new Error('User email linked to another account')
    }

    // Create user
    const Car = await User.create({
        username,
        make,
        model,
        licensePlate,
        color,
    })

    if (user && verified(token, res)) {
        res.status(200).json({
            _id: user.id,
            username: user.username,
            make: user.make,
            model: user.model,
            licensePlate: user.licensePlate,
            color: user.color,
        })
    } else {
        return res.status(400).json({ message: 'Invalid Car data' })
        // throw new Error ('Invalid user data')
    }
})

// @desc Gets all cars associated with a username
// @route GET /api/car/getcars
// @access Public
const getCars = asyncHandler (async (req, res) => {
    const { username } = req.body
    const token = req.headers['authorization']
    
    const cars = await Car.findAll({username})

    if (!username) {
        return res.status(400).json({ message: 'Please provide a username' })
        // throw new Error('Please enter a username and password')
    }

    if (!token) {
        return res.status(401).json({ message: 'Please log in' });
      }

    if (user && verified(token, res)) {
        res.json({
            cars: cars
        })
    } else {
        return res.status(400).json({ message: 'Invalid token please login again' })
        // throw new Error('Username or password incorrect')
    }
})

module.exports = {
    addCar,
    getCars
}
