const BaseEvent = require('../../utils/structures/BaseEvent');
const Discord = require('discord.js');
const mongoose = require('mongoose')
const Afk = require('../../database/models/afkSchema');
const Setting = require('../../database/models/settingsSchema');
const Mudae = require('../../database/models/mudaeSchema');
const odm = require('../../odm.js')
const fetch = require('node-fetch');
require('dotenv').config()

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('messageCreate');
  }

  async run(client, message) {
    //#region Mudae Reminder
    const mudaeRegExp = new RegExp(/^\*\*(.+)\*\*, the roulette is limited to \d{2} uses per hour.+/i)
    if (message.author.id === '432610292342587392' && mudaeRegExp.test(message.content)) {
      const [, username] = message.content.match(mudaeRegExp)
      const member = await message.guild.members.fetch({ query: username, limit: 1})
      if (!await Mudae.findOne({ userID: member.first().id })) return;
      await Mudae.updateOne({ userID: member.first().id }, { hasRolled: true })
        .catch(error => console.error(error))
    }
    //#endregion
    if (!message.guild) return;
    if (message.author.bot) return;
    
    //#region AFK Command
    if (await Afk.findOne({ userID: message.author.id, guildID: message.guild.id, timeUp: true })) {//Removes AFK
      await Afk.deleteOne({ userID: message.author.id, guildID: message.guild.id, timeUp: true });
      if (message.member.displayName.startsWith('[AFK] ')) {
        message.member.setNickname(message.member.displayName.slice(6))
      }
      try {
        const removeAFK = await message.reply({ content: 'Welcome back **' + message.author.tag + '**, I have removed your AFK.', allowedMentions: { repliedUser: true }})
        setTimeout(async () => {
          await removeAFK.delete();
        }, 5000);
      }
      catch (error) {
        console.error(error)
      }
    }
    if (message.mentions.members.first()) { //Returns AFK Status on ping
      await message.mentions.members.forEach(async member => {
        let afkProfile = await Afk.findOne({ userID: member.user.id, guildID: message.guild.id });
        if (afkProfile) {
          message.reply({ content: member.user.tag + ' is AFK: ' + afkProfile.reason + ' - ' + odm.msParse(Date.now() - afkProfile.timeSet, 1) + ' ago' });
        }
      });
    }
    //#endregion
    
    //#region Subject Zero & Sparkles Image Logs
    const imageLogs = ['757346743598710866', '801727638041395220', '878215231560622130']
    const imageLogsChannels = ['845922372933910529', '875297742560329748', '878222402927075338']
    if (imageLogs.includes(message.guild.id) && message.attachments.first()) {
      const c = message.guild.channels.cache.get(imageLogsChannels[imageLogs.indexOf(message.guild.id)])
      message.attachments.each(async (a) => {
        if (a.height) {
          try {
            await odm.imageLogEmbed(message, a, c);
          }
          catch (error) {
            console.error(error);
          }
        }
      })
    }
    //#endregion
    
    //#region New Setting Creation
    let db = await Setting.findOne({ guildID: message.guild.id })
    if (!db) {
      db = await new Setting({
        _id: mongoose.Types.ObjectId(),
        guildID: message.guild.id,
        entrylist: new Map(),
        restrictlist: new Map(),
        renablelist: new Map(),
        rdisablelist: new Map(),
        prefix: '-'
      })
      await db.save()
    }
    //#endregion

    client.prefix = db.prefix
    //#region Prefix on Mention
    const botMention = new RegExp(/^(?:<@!?823063174378029096>)$/)
    if (botMention.test(message.content.trim())) {
      const prefixEmbed = new Discord.MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setColor(odm.color)
          .setTitle('Prefix')
          .setDescription('My prefix is `' + client.prefix + '`.')
          .setFooter('Bot by xKWG.')
          .setTimestamp()
      return message.reply({ embeds: [prefixEmbed], allowedMentions: { repliedUser: true }})
    }
    //#endregion

    //#region Command Check
    if (message.content.toLowerCase().startsWith(client.prefix) || message.content.toLowerCase().startsWith('<@!823063174378029096>')) {
      let mentionPrefixlength = 22
      if (message.content.toLowerCase().startsWith(client.prefix)) {
        mentionPrefixlength = client.prefix.length
      }
      const [commandName, ...commandArgs] = message.content
      .slice(mentionPrefixlength)
      .trim()
      .split(/\s+/);
      const command = client.commands.get(commandName.toLowerCase());
      if (!command) return;

      //#region Server Settings
      let challowed = true
      let rallowed = true
      //#region Channels
      if (db.restrictlist.get(command.name)) {
        if (db.restrictlist.get(command.name).includes((message.channel.id))) {
          challowed = false
        }
        if (db.restrictlist.get(command.name).includes('all')) {
          challowed = false
        }
      }
      if (db.entrylist.get(command.name)) {
        if (db.entrylist.get(command.name).includes((message.channel.id || all))) {
          challowed = true
        }
        if (db.entrylist.get(command.name).includes('all')) {
          challowed = true
        }
      }
      //#endregion
      //#region Roles
      if (db.rdisablelist.get(command.name)) {
        if (db.rdisablelist.get(command.name).some(r => message.member.roles.cache.has(r))) {
          rallowed = false
        }
        if (db.rdisablelist.get(command.name).includes('all')) {
          rallowed = false
        }
      }
      if (db.renablelist.get(command.name)) {
        if (db.renablelist.get(command.name).some(r => message.member.roles.cache.has(r))) {
          rallowed = true
        }
        if (db.rdisablelist.get(command.name).includes('all')) {
          rallowed = true
        }
      }
    //#endregion
      if (message.author.id === process.env.OWNERID) {
        challowed = true
        rallowed = true
      }
      if (!challowed || !rallowed) {
        return
      }
      //#endregion
      
      //#region The Fire Jedi Command Restrictions
      let resArray = ['afk', 'snipe', 'editsnipe', 'bon', 'ping', 'firstmessage', 'time', 'suggest']
      if (message.guild.id === '376455862920806401' && message.channel.id !== '376470241485651969' && !resArray.includes(command.name) && message.author.id !== '393889222496616468' && !client.guilds.cache.get('824159759041167390').member(message.author).roles.cache.has('848133512402173952')) {
        return message.reply({ content: 'Go to <#376470241485651969> to run bot commands.', allowedMentions: { repliedUser: true }})
      }
      //#endregion

      //#region Command Cooldowns
      if (command) {
        if (!client.cooldown.has(command.name)) {
          client.cooldown.set(command.name, new Discord.Collection());
        }      
        const now = Date.now();
        const timestamps = client.cooldown.get(command.name);
        let cooldownAmount = (command.cooldown || 3) * 1000;
        if (message.author.id === '393889222496616468' || message.member.roles.cache.has('842776022533668906')) {
          cooldownAmount = 0
        }
        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const cooldownEmbed = new Discord.MessageEmbed()
                .setTitle("You are on cooldown.")
                .setDescription('Please wait ' + timeLeft.toFixed(1) + ' more second(s) before using the `' + command.name + '` command.')
                .setColor(message.member.roles.highest.hexColor)
                .setFooter(message.author.tag + ' is on cooldown.')
                .setTimestamp()
            return message.reply({ embeds: [cooldownEmbed], allowedMentions: { repliedUser: false }})
          }
        }
      
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
      //#endregion
      
      if (command) {
        client.commandCounter += 1;
        if (command.category === 'music' && message.guild.id !== '757346743598710866') return;
        const channelId = ['866219522871787540', '880646041895075850']
        const info = new Discord.MessageEmbed()
          .setTitle('Command Run')
          .setColor('#7283F2')
          .setAuthor(client.user.tag)
          .setDescription('**Command:** ' + command.name + '\nServer: ' + message.guild.name + ' (' + message.guild.id + ')\nChannel: #' + message.channel.name + ' (' + message.channel.id + ')\nRun by: ' + message.author.id + ' (<@' + message.author.id + '>)\n' + 'Args: ```' + message.content + '```');
        try {
          await client.channels.cache.get(channelId[0]).send({ embeds: [info] })
          await command.run(client, message, commandArgs)
        }
        catch (error) {
          console.error(error)
          const errorEmbed = new Discord.MessageEmbed()
            .setTitle('Error! :warning:')
            .setColor(odm.color)
            .setDescription('**Command:** ' + command.name + '\nServer: ' + message.guild.name + ' (' + message.guild.id + ')\nChannel: #' + message.channel.name + ' (' + message.channel.id + ')\nRun by: ' + message.author.id + ' (<@' + message.author.id + '>)\n```' + error.stack.toString() + '```')
            .setTimestamp();
          await client.channels.cache.get(channelId[1]).send({ embeds: [errorEmbed] });
        }
      }
    }
    //#endregion
  }
}