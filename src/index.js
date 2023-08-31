const { Client } = require('discord.js');
const Discord = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES'], allowedMentions: { parse: ['everyone', 'roles', 'users'], repliedUser: false } });
const mongoose = require('./database/mongoose');
const { Player } = require("discord-music-player");

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.cooldown = new Discord.Collection();
  client.snipes = new Discord.Collection();
  client.editsnipes = new Discord.Collection();
  client.prefix = config.prefix;
  client.token = config.token;
  client.musicQueue = new Discord.Collection();
  client.player = new Player(client, { leaveOnEmpty: false, leaveOnStop: false, leaveOnEnd: false, timeout: 300000 });
  client.swagrole = 0;
  client.commandCounter = 0;
  client.memberCount = 0;
  mongoose.init();
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
})();
