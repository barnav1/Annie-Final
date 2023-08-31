const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const Mudae = require('../../database/models/mudaeSchema');
const Setting = require('../../database/models/settingsSchema')

module.exports = class MudaeremindCommand extends BaseCommand {
  constructor() {
    super('mudaeremind', 'anime', ['mr', 'mrm'], 6, 'Allows you to enable or disable reminders for Mudae roll resets.', '-mr enable');
  }

  async run(client, message, args) {
    let mudae;
    try {
      mudae = await message.guild.members.fetch('432610292342587392')
    }
    catch (error) {
      console.error(error);
    }
    if (!mudae) {
      return message.reply({ content: 'This server does not have the Mudae bot. Invite it first before enabling Mudae reminders.' })
    }
    //#region Voted
    let data;
    try {
      const voteFetch = await fetch('https://top.gg/api/bots/823063174378029096/check?userId=' + message.author.id, { 
        method: 'GET',
        headers: { "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyMzA2MzE3NDM3ODAyOTA5NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjMwMzgxNzI2fQ.JtN23q3mTHvz0D651jNFYKWmM8kojEFyJgrUKGz71EQ" }
      })
      data = await voteFetch.json()
    }
    catch (error) {
      console.error(error);
    }
    const voteCollection = await client.channels.cache.get('880484435206750298').messages.fetch();
    const votedRegex = new RegExp(/User: .+\(id:(.+)\).+\n.+\n\nYou can vote on (.+) \*\*\[here\].+|User: .+\(id:(.+)\).+just voted on (.+)!/gm)
    const topggVoted = Boolean(data.voted)
    function messageVotedFilter(m) {
      const array = votedRegex.exec(m.embeds[0].description)
      if (!array) {
        return false
      }
      else if ((Date.now() - m.createdTimestamp) < 43200000 && array[1] === message.author.id && array[2] === 'discordbotlist.com') {
        return true
      }
    }
    const dblVoted = voteCollection.some(m => messageVotedFilter(m))
    if (!(topggVoted || dblVoted)) {
      const row = new Discord.MessageActionRow()
      .addComponents([
        new Discord.MessageButton()
          .setLabel('Top.gg')
          .setStyle('LINK')
          .setURL('https://top.gg/bot/823063174378029096/vote'),
        new Discord.MessageButton()
          .setLabel('dbl.com')
          .setStyle('LINK')
          .setURL('https://discordbotlist.com/bots/annie-leonhart/upvote')
      ]);
      const embed = new Discord.MessageEmbed()
        .setTitle('Voter Only')
        .setDescription('The `mudaeremind` command is for voters only! You can become one by voting for the bot on Top.gg or dbl.com.')
        .setColor(odm.color);
      return message.channel.send({ embeds: [embed], components: [row] })
    }
    //#endregion
    if (!args[0]) {
      return message.reply({ content: 'You ran the command incorrectly; run `' + client.prefix + 'help mudaeremind` for more details.' })
    }
    const server = await Setting.findOne({ guildID: message.guild.id })
    if (server.mrTime === 1000) {
      return message.reply({ content: "You don't have Mudae reminders configured on your server. Run `" + client.prefix + "settings mudaeRemind enable` to get started." })
    }
    let db = await Mudae.findOne({ userID: message.author.id, guildID: message.guild.id })

    if (args[0] === 'enable') {
      if (!args[1]) {
        return message.reply({ content: "You didn't specify a reminder type. Run `" + client.prefix + "help mudaeremind` for more details." })
      }
      if (args[1] === 'hourly' || args[1] === 'smart') {
        let k = 'Mudae reminders enabled and type set as **' + args[1] + '.**'
        if (db) {
          db.reminderType = args[1]
          k = 'Mudae reminder type changed to **' + args[1] + '.**' 
        }
        else {
          db = await new Mudae({
            _id: mongoose.Types.ObjectId(),
            userID: message.author.id,
            guildID: message.guild.id,
            reminderType: args[1],
            hasRolled: false,
          })
        }
        await db.save()
          .catch((error) => {
            console.error(error)
            return message.reply({ content: 'I ran into an issue disabling your reminders. Please try again.' })
          })
        return message.reply({ content: k })
      }
      else {
        return message.reply({ content: 'Please specify a valid reminder type (either hourly or smart).' })
      }
    }
    if (args[0] === 'disable') {
      if (!db) {
        return message.reply({ content: 'You do not have reminders enabled.' })
      }
      try {
        await Mudae.deleteOne({ userID: message.author.id })
        await message.reply({ content: 'Disabled Mudae reminders for **' + message.author.tag + '.**' })
      }
      catch (error) {
        console.error(error)
        return message.reply({ content: 'I ran into an issue disabling your reminders. Please try again.' })
      }
    }
    else {
      return message.reply({ content: 'You must choose to either enable or disable Mudae reminders.' })
    }
  }
}