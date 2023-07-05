require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

// Database setup
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(require('./routes'))

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})