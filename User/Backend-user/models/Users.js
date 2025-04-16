const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema ({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})
const Users = mongoose.model('Users', userSchema)
module.exports = Users