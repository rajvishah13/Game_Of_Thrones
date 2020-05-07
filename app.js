const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const displayRoutes = require('./routes/display');

app.use('/display', displayRoutes);

//ROUTES
app.get('/', (req,res) => {
    res.send('We are on home');
});

//Connect to DB
mongoose.connect('mongodb://localhost:27017/battles', 
    { useNewUrlParser: true,
    useUnifiedTopology: true},
    () => console.log('Connected to MongoDB!')
);

//How do we listen to the port?
app.listen(5000);