const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectToMongo = require('./db');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); 
const port = 5001
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
app.use('/', require('./routes/DisasterControl'))
// MongoDB setup
connectToMongo()