const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Car = require('../models/carModel')
const User = require('../models/accountModel')

// @desc Add new car
// @route POST /api/car
// @access Public
const addCar = asyncHandler (async (req, res) => {
    const { username, make, model, licensePlate, color } = req.body

    if (!make || !model || !licensePlate || !color) {
        return res.status(400).json({ message: 'Please fill out all fields' })
    }

    const userExists = await User.findOne({username})
    const carExists = await Car.findOne({username, make, model, licensePlate, color})
    console.log(carExists)

    if (carExists) {
        return res.status(400).json({ message: 'Car is already linked to this account' })
        // throw new Error('User email linked to another account')
    }

    if (!userExists) {
        return res.status(400).json({ message: 'Invalid Username' })
    }

    // Create car
    const car = await Car.create({
        username,
        make,
        model,
        licensePlate,
        color,
    })
    
    if (car && userExists) {
        res.status(200).json({
            _id: car.id,
            username: car.username,
            make: car.make,
            model: car.model,
            licensePlate: car.licensePlate,
            color: car.color,
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
    
    const userExists = await User.findOne({username})
    const cars = await Car.find({username})

    if (!username) {
        return res.status(400).json({ message: 'Please provide a username' })
        // throw new Error('Please enter a username and password')
    }

    if (!userExists) {
        return res.status(400).json({ message: 'Invalid Username' })
    }

    if (cars) {
        res.json({
            cars: cars
        })
    } else {
        return res.status(400).json({ message: 'Invalid token please login again' })
        // throw new Error('Username or password incorrect')
    }
})

// @desc Removes car
// @route DELETE /api/car/removeCar
// @access Public
const removeCar = asyncHandler (async (req, res) => {
    const { username, make, model, licensePlate, color } = req.body
    const car = await Car.findOne({ username, make, model, licensePlate, color })
    const carId = car.id


    Car.findByIdAndDelete(carId)
    .then(result => {
        if (result) {
            res.status(200).json({ message: 'Car deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Car not found.' });
        }
    })
    .catch(err => {
        res.status(500).json({ message: 'Error deleting car.', error: err });
    });
})

module.exports = {
    addCar,
    getCars,
    removeCar
}
