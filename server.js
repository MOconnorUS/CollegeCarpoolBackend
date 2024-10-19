const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const cors = require('cors')
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())


app.use('/api/accounts', require('./routes/accountRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server start on port ${port}`))