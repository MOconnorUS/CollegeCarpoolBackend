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
        return res.status(400).json({ message: 'Please fill out all fields' })
        // throw new Error('Please fill out all fields')
    }

    const userEmailExists = await User.findOne({email})
    const usernameExists = await User.findOne({username})
    const userPhoneNumberExists = await User.findOne({phoneNumber})
    // console.log(userEmailExists)
    // console.log(usernameExists)
    // console.log(userPhoneNumberExists)

    if (userEmailExists) {
        return res.status(400).json({ message: 'User email linked to another account' })
        // throw new Error('User email linked to another account')
    }

    if (usernameExists) {
        return res.status(400).json({ message: 'Username taken' })
        // throw new Error('Username taken')
    }

    if (userPhoneNumberExists) {
        return res.status(400).json({ message: 'User phone number linked to another account' })
        // throw new Error('User phone number linked to another account')
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
        return res.status(400).json({ message: 'Invalid user data' })
        // throw new Error ('Invalid user data')
    }
})

// @desc Login valid user
// @route POST /api/accounts/login
// @access Public
const login = asyncHandler (async (req, res) => {
    const { username, password } = req.body
    
    const user = await User.findOne({username})
    const retUsername = user.username
    const retFirstName = user.firstName
    const retLastName = user.lastName
    const retEmail = user.email
    const retPhoneNumber = user.phoneNumber

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter a username and password' })
        // throw new Error('Please enter a username and password')
    }

    if (user && (await argon2.verify(user.password, password))) {
        res.json({
            username: retUsername,
            firstName: retFirstName,
            lastName: retLastName,
            email: retEmail,
            phoneNumber: retPhoneNumber,
            token: generateToken(user._id)
        })
    } else {
        return res.status(400).json({ message: 'Username or password incorrect' })
        // throw new Error('Username or password incorrect')
    }
})

module.exports = {
    registerUser,
    login
}
