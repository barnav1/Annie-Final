const mongoose = require('mongoose');

const totalSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    onlineTime: Number,
    idleTime: Number,
    dndTime: Number,
})
module.exports = new mongoose.model('Total', totalSchema, 'totals')