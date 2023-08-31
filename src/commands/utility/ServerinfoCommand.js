const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class ServerinfoCommand extends BaseCommand {
  constructor() {
    super('serverinfo', 'utility', ['si'], 15, 'Returns information about the server.', 'serverinfo');
  }

  async run(client, message, args) {
    try {
      const g = await message.guild.fetch()
      const gOwner = await message.guild.members.fetch(g.ownerId)
      const guildCreated = new Date(g.createdTimestamp)
      const daysAgo = (ms) => Math.floor(ms / (1000 * 60 * 60 * 24)).toString()
      const embed = new Discord.MessageEmbed()
        .setTitle('Server Info for ' + g.name)
        .setColor('#7283F2')
        .setThumbnail(g.iconURL({ dynamic: true }))
        .addField("Server Created:", guildCreated.toLocaleDateString({ timeZone: 'UTC' }).replace(/\//gi, "-") + ' ' + guildCreated.toLocaleTimeString('en-GB', { timeZone: 'UTC'}) + ' UTC \n(' + daysAgo(Date.now() - guildCreated.getTime()) + ' days ago)', true)
        .addField('Member Count:', g.approximateMemberCount.toString(), true)
        .addField('Boosts:', g.premiumSubscriptionCount + ' (Tier ' + (g.premiumTier === 'NONE' ? '0' : g.premiumTier.slice(-1)) + ')', true)
        .addField('Channels: ', '<:textchannel:863399379733315614> Text Channels: ' +  g.channels.cache.filter(c => c.type === 'GUILD_TEXT').size + '\n<:voicechannel:863399545987792907> Voice Channels: ' + g.channels.cache.filter(c => c.type === 'GUILD_VOICE').size, true)
        .addField('Owner:', '<@' + g.ownerId + '> (' + gOwner.user.tag + ')', true)
        .addField('Roles:', (g.roles.cache.size - 1).toString(), true)
        .addField('Vanity URL:', g.vanityURLCode ? ('https://discord.gg/' + g.vanityURLCode) : 'none')
        .setImage(g.bannerURL({ dynamic: true, type: 'png' }))
        .setFooter('Owner: ' + gOwner.user.tag)
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }})
    }
    catch (error) {
      console.error(error);
      return message.reply({ content: 'I ran into an issue, please try again.' })
    }
  }
}