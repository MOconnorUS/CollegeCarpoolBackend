const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const asyncHandler = require('express-async-handler')
const User = require('../models/accountModel')

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',

    })
}

// @desc Register new user
// @route POST /api/accounts
// @access Public
const registerUser = asyncHandler (async (req, res) => {
    const { firstName, lastName, email, phoneNumber, username, password } = req.body

    if (!firstName || !lastName || !email || !phoneNumber || !username || !password) {
        res.status(406)
        throw new Error('Please fill out all fields')
    }

    // Check if user exists, COME BACK TO
    const userEmailExists = await User.findOne({email})
    const usernameExists = await User.findOne({username})
    const userPhoneNumberExists = await User.findOne({phoneNumber})
    console.log(userEmailExists)
    console.log(usernameExists)
    console.log(userPhoneNumberExists)

    if (userEmailExists) {
        res.status(401)
        throw new Error('User email linked to another account')
    }

    if (usernameExists) {
        res.status(402)
        throw new Error('Username taken')
    }

    if (userPhoneNumberExists) {
        res.status(405)
        throw new Error('User phone number linked to another account')
    }

    // Hash password
    const hashedPassword = await argon2.hash(password)

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password: hashedPassword
    })

    if (user) {
        res.status(200).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            username: user.username,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error ('Invalid user data')
    }
})

// @desc Login valid user
// @route POST /api/accounts/login
// @access Public
const login = asyncHandler (async (req, res) => {
    const { username, password } = req.body
    
    const user = await User.findOne({username})

    if (!username || !password) {
        res.status(401)
        throw new Error('Please enter a username and password')
    }

    if (user && (await argon2.verify(user.password, password))) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            username: user.username,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Username or password incorrect')
    }
})

module.exports = {
    registerUser,
    login
}
