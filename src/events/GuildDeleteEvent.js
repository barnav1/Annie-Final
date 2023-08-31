// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require('../utils/structures/BaseEvent');
const Discord = require('discord.js');
const odm = require('../odm.js');
const mongoose = require('mongoose');
const Afk = require('../database/models/afkSchema');
const Mudae = require('../database/models/mudaeSchema');
const Setting = require('../database/models/settingsSchema');



module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(client, guild) {
    if (!guild.name) return;
    try {
      await Afk.deleteMany({ guildID: guild.id })
      await Mudae.deleteMany({ guildID: guild.id })
      await Setting.deleteMany({ guildID: guild.id })
      const leaveEmbed = new Discord.MessageEmbed()
        .setTitle('Guild Left')
        .setColor('#F54E4E')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addField('Name', guild.name + ' (' + guild.id + ')')
        .addField('Members', guild.members.cache.size.toString())
        .setFooter(guild.id)
        .setTimestamp();
      await client.channels.cache.get('880643799590776843').send({ embeds: [leaveEmbed] })
    }
    catch (error) {
      console.error(error)
      const errorEmbed = new Discord.MessageEmbed()
          .setTitle('Error! :warning:')
          .setColor(odm.color)
          .setDescription('**Command:** guildDelete Event \nServer: ' + guild.name + ' (' +   guild.id + ')\n```js\n' + error.stack.toString() + '```')
          .setTimestamp();
      return client.channels.cache.get('880646041895075850').send({ embeds: [errorEmbed] })
    }
  }
}