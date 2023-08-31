const BaseCommand = require('../../utils/structures/BaseCommand');
const Afk = require('../../database/models/afkSchema')
const mongoose = require('mongoose');
const Discord = require('discord.js')
const odm = require('../../odm.js')

module.exports = class AfkCommand extends BaseCommand {
  constructor() {
    super('afk', 'utility', [], 5, "Changes the member's server nickame to [AFK] Username and sets a status that the bot returns when that user is pinged. Sending a message more than 20 seconds after the status is set causes the AFK to automatically be removed.", 'afk [status]');
  }

  async run(client, message, args) {
    if (args[0] === "list") { //AFK List
      const db = await Afk.find({ guildID: message.guild.id })
      let field = []
      const afkList = new Discord.MessageEmbed()
          .setTitle('AFK List')
          .setColor("#5C52D5")
          .setTimestamp()
      for (let i = 0; i < db.length; i++) {
        let afkMember = []
        try {
          afkMember = await message.guild.members.fetch(db[i].userID)
        }
        catch (error) {
          console.error(error)
        }
        const nick = afkMember.nickname || afkMember.user.username  
        field = ['**' + nick + ' - ' + db[i].userID + '**', db[i].reason + ' - ' + odm.msParse(Date.now() - db[i].timeSet, 1) + ' ago']
        afkList.addField(field[0], field[1])
      }
      return message.reply({ embeds: [afkList] })
    }

    let reason = args.join(' ');
    if (!reason) {
      reason = 'AFK'
    }
    
    await Afk.deleteOne({ userID: message.author.id, guildID: message.guild.id });

    const afkProfile = await new Afk({
      _id: mongoose.Types.ObjectId(),
      userID: message.author.id,
      guildID: message.guild.id,
      timeSet: Date.now(),
      reason: reason,
    })

    await afkProfile.save();
    const options = {
      content: '**' + message.author.tag + '**, you are AFK: ' + reason, 
      allowedMentions: { 
        repliedUser: true, 
        parse: message.member.permissions.has(Discord.Permissions.FLAGS.MENTION_EVERYONE) ? ['users', 'roles'] : ['users']  
      }
    }
    await message.reply(options);
    if (!message.member.displayName.startsWith('[AFK] ') && message.member.roles.highest.rawPosition < message.guild.me.roles.highest.rawPosition && message.author.id !== message.guild.ownerId) {
      try {
        await message.member.setNickname('[AFK] ' + message.member.displayName)
      } 
      catch (error) {
        console.error(error)        
      }
    }
    setTimeout(() => {
      afkProfile.timeUp = true
      afkProfile.save();
    }, 20000);
  }
}