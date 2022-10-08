require('dotenv').config()
//Required packages
const express = require('express')
const app = express()
const mongoose = require('mongoose')

//Connect the database to the app (Database Connection)
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

//Link route files
const certificateRouter = require('./routes/certificate')

app.use('/cert',certificateRouter)

app.listen(3000, () => console.log ('Server Started'))