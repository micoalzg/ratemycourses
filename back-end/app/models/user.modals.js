const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    yearOfStudy: Number,
    programOfStudy: [String],
    courses: [String],
    takenCourses: [String],
    password: String,
    isAdmin: Boolean,
    banned: Boolean,
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);