const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    timeStarted: Number,
    presenceType: String,
    timeChange: Number,
    userID: String,
    wk: [],
    online: [],
    idle: [],
    dnd: [],
    day: Number,
});

module.exports = new mongoose.model('Presence', presenceSchema, 'presences')