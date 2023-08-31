const mongoose = require('mongoose');

const afkSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    timeSet: Number,
    reason: String,
    timeUp: { type: Boolean, default: false }
});

module.exports = new mongoose.model('Afk', afkSchema, 'afks')