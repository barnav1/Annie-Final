const mongoose = require('mongoose');

const placeholder = new Map()
placeholder.set('placeholder', ['1', '2'])

const settingsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    entrylist: { type: Map, default: placeholder },
    restrictlist: { type: Map, default: placeholder },
    renablelist: { type: Map, default: placeholder },
    rdisablelist: { type: Map, default: placeholder },
    mrTime: { type: Number, default: 1000 },
    prefix: { type: String, default: '-' }
});

module.exports = new mongoose.model('Setting', settingsSchema, 'settings')