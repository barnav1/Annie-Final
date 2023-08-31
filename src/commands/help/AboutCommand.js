const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
const { Permissions } = require('discord.js')
const OS = require('os')
const infb = require('../../../package.json')
const odm = require('../../odm.js');

module.exports = class AboutCommand extends BaseCommand {
  constructor() {
    super('about', 'help', ['info', 'stats'], null, 'Displays general information and statistics for the bot.', 'about');
  }

  async run(client, message, args) {
    function timerArrayVar(timeLeft) {
      let myArray = []
      myArray[0] = Math.floor(timeLeft % 60)
      myArray[1] = Math.floor((timeLeft / 60) % 60)
      myArray[2] = Math.floor((timeLeft / (60*60)) % 24)
      myArray[3] = Math.floor((timeLeft / (60*60*24)) % 30.42)
      return myArray
    }
    function getLoad() {
      let oldCPUTime = 0
      let oldCPUIdle = 0
      let cpus = OS.cpus()
      let totalTime = -oldCPUTime
      let totalIdle = -oldCPUIdle
      for (let i = 0; i < cpus.length; i++) {
        let cpu = cpus[i]
        for (let type in cpu.times) {
          totalTime += cpu.times[type];
          if (type == "idle") {
            totalIdle += cpu.times[type];
          }
        }
      }

      var CPUload = 100 - Math.round(totalIdle / totalTime * 100)
      oldCPUTime = totalTime
      oldCPUIdle = totalIdle

      return {
        CPU: CPUload,
        mem: ((process.memoryUsage().rss / 1024 / 1024 * 100) / 100).toFixed(2)
      }
    }
    const inviteLink = client.generateInvite({
      scopes: ['applications.commands', 'bot'],
      permissions: [Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.CHANGE_NICKNAME, Permissions.FLAGS.MANAGE_NICKNAMES, Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS, Permissions.FLAGS.MANAGE_WEBHOOKS, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.USE_PUBLIC_THREADS, Permissions.FLAGS.USE_PRIVATE_THREADS, Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_THREADS, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.MENTION_EVERYONE, Permissions.FLAGS.USE_EXTERNAL_EMOJIS, Permissions.FLAGS.ADD_REACTIONS],
    })
    let count = 0
    client.commands.forEach((c, ckey) => {
      if (!c.aliases.includes(ckey)) {
        count++;
      }      
    })
    await odm.memberCount(client);
    const uptime = timerArrayVar(client.uptime / 1000)
    const aboutEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setColor('#a0cdf2')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription('Welcome to the Annie Leonhart bot! Annie is a custom Discord bot that was originally made for the Subject Zero discord server.')
        .addField('Users', '```' + client.memberCount + '```', true)
        .addField('Commands', '```' + count + '```', true)
        .addField('Servers', '```' + client.guilds.cache.size + '```', true)
        .addField('CPU Usage: ', '```' + getLoad().CPU + '%```', true)
        .addField('RAM Usage: ', '```' + getLoad().mem + ' MB```', true)
        .addField('Uptime', '```' + uptime[3] + 'd ' + uptime[2] + 'h ' + uptime[1] + 'm ' + uptime[0] + 's ```', true)
        .addField('Channels:  ' + client.channels.cache.size, '<:textchannel:863399379733315614> Text Channels: ' +  client.channels.cache.filter(c => c.type === 'GUILD_TEXT').size + '\n<:voicechannel:863399545987792907> Voice Channels: ' + client.channels.cache.filter(c => c.type === 'GUILD_VOICE').size)
        .addField('Commands Run since start', client.commandCounter.toString())
        .addField('Built with', '<:nodejs:880493276568883310> v' + infb.dependencies['node'].slice(1) + '\n <:discordjs:880493186353627166> v' + infb.dependencies['discord.js'].slice(1) + '\n <:mongoose:880495181911183380> v' + infb.dependencies.mongoose.slice(1))
        .setFooter('Bot by xkwg.youtuber#3685 | Running since March 2021');
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setLabel('Invite')
          .setStyle('LINK')
          .setURL(inviteLink)
      )
      .addComponents(
        new Discord.MessageButton()
          .setLabel('Top.gg')
          .setStyle('LINK')
          .setURL('https://top.gg/bot/823063174378029096')
      );
    return message.reply({ embeds: [aboutEmbed], allowedMentions: { repliedUser: false }, components: [row] });
  }
}