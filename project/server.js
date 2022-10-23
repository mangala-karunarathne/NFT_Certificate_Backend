// require('dotenv').config()
// //Required packages
// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')

// //Connect the database to the app (Database Connection)
// mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser: true})
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to Database'))

// app.use(express.json())

// //Link route files
// const certificateRouter = require('./routes/certificate')

// app.use('/cert',certificateRouter)

// app.listen(5000, () => console.log ('Server Started'))

const path = require('path');
const express = require('express');
// const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));