const mongoose = require('mongoose');

const constantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reminderCounter: Number,
});

module.exports = new mongoose.model('Constant', constantSchema, 'constants')