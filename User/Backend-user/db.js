const mongoose = require('mongoose');
const connectToMongo = async () => {
    await mongoose.connect('mongodb+srv://ayushdb:ayushdb@test.te9rbkk.mongodb.net/?retryWrites=true&w=majority&appName=test')
    console.log('Connected to Mongo successfully')
}
module.exports = connectToMongo