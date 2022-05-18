const mongoose = require('mongoose');
// import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Must Provide an Email']
    },
    name: {
        type: String,
        required: [true, 'Must Provide a Name']
    },
    password: {
        type: String,
        required: [true, 'Must Provide a Password']
    }
});

// This is basic validation not advanced
module.exports = mongoose.models.users || mongoose.model('users', UserSchema);