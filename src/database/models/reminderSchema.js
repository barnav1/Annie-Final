const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reminderID: Number,
    userID: String,
    messageURL: String,
    timeSet: Number,
    duration: Number,
    reason: String,
});

module.exports = new mongoose.model('Reminder', reminderSchema, 'reminders')