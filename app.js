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

app.use('/', displayRoutes);

//Connect to DB
mongoose.connect('mongodb://localhost:27017/battles', 
    { useNewUrlParser: true,
    useUnifiedTopology: true},
    () => console.log('Connected to MongoDB!')
);

//How do we listen to the port?
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
