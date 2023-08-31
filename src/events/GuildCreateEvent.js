// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const Discord = require('discord.js');
const BaseEvent = require('../utils/structures/BaseEvent');
const odm = require('../odm.js');
module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate');
  }
  
  async run(client, guild) {
    try {
      const g = await guild.fetch()
      const owner = await g.members.fetch(g.ownerId)
      const joinEmbed = new Discord.MessageEmbed()
        .setTitle('New Guild!')
        .setColor(odm.color)
        .setThumbnail(g.iconURL({ dynamic: true }))
        .addField('Name', g.name)
        .addField('Owner', owner.user.tag + ' (' + g.ownerId + ')')
        .addField('Member Count', g.approximateMemberCount.toString())
        .setTimestamp();
      await client.channels.cache.get('880643799590776843').send({ embeds: [joinEmbed] })
    }
    catch (error) {
      console.error(error)
    }
  }
}