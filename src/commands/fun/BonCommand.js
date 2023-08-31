const BaseCommand = require('../../utils/structures/BaseCommand');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const odm = require('../../odm.js');

module.exports = class BonCommand extends BaseCommand {
  constructor() {
    super('bon', 'fun', [], null, '"Bans" the mentioned user, or the one who ran the command if no one is mentioned.', 'bon [@user/ID]');
  }

  async run(client, message, args) {
    if (message.guild.id === '757346743598710866') {
      if ((message.author.id !== '694219054428192789') && (message.author.id !== '393889222496616468') && (!message.member.roles.cache.has('819819395680436265'))) {
        return message.reply({ content: "Imagine trying to ban without perms." })
      }
    }
    //#region Checking if Voted
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
        .setDescription('The `bon` command is for voters only! You can become one by voting for the bot on Top.gg or dbl.com.')
        .setColor(odm.color);
      return message.channel.send({ embeds: [embed], components: [row] })
    }
    //#endregion
    let target;
    if (Number(args[0])) {
      try {
        target = await message.guild.members.fetch(args[0])
      }
      catch (error) {
        console.error(error)
        target = message.member
      }
    }
    else {
      target = message.mentions.members.first() || message.member;
    }
    target = target.user
    await message.delete();
    if (target.id === '393889222496616468') {
      return message.channel.send('Banned **' + message.author.tag + '.**')
    }
    else if (target.id === '823063174378029096') {
      return message.channel.send('No. :raised_hand: Only Armin can ban me. :smirk:')
    }
    else {
      return message.channel.send('Banned **' + target.tag + '.**')
    }
  }
} 
