const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, "Please provide the user's username"]
    },
    make: {
        type: String,
        require: [true, 'Please add the Car Make']
    },

    model: {
        type: String,
        require: [true, 'Please add the Car Model']
    },

    licensePlate: {
        type: String,
        require: [true, 'Please add the Car License Plate'],
        unique: true
    },

    color: {
        type: String,
        require: [true, 'Please add the Car color']
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Car', carSchema)