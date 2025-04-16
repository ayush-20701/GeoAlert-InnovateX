const express = require('express');
const bodyParser = require('body-parser');
const connectToMongo = require('./db');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors()); 
const port = 5000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
app.use('/', require('./controllers/CheckDisaster'))
app.use('/auth', require('./controllers/UserControl'))
// MongoDB setup
connectToMongo()