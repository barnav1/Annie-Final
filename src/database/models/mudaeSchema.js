const mongoose = require('mongoose');

const mudaeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    reminderType: String,
    hasRolled: Boolean,
});

module.exports = new mongoose.model('Mudae', mudaeSchema, 'mudaes')