const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: [true, 'Please add a First Name']
    },

    lastName: {
        type: String,
        require: [true, 'Please add a Last Name']
    },

    email: {
        type: String,
        require: [true, 'Please add an email'],
        unique: true
    },

    phoneNumber: {
        type: String,
        require: [true, 'Please add a phone number'],
        unique: true
    },

    username: {
        type: String,
        require: [true, 'Please add a username'],
        unique: true
    },

    password: {
        type: String,
        require: [true, 'Please add a password']
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)