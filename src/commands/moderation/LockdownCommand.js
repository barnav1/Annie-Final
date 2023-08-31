const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js');

module.exports = class LockdownCommand extends BaseCommand {
  constructor() {
    super('lockdown', 'moderation', ['lock', 'l'], null, 'Makes the channel read-only for @everyone. You must have the Manage Permissions permission to use this command.', 'lockdown [#channel/ID]');
  }

  async run(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return message.reply({ content: 'You do not have the `MANAGE_PERMISSIONS` permission required to use this command.' })
    }
    else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return message.reply({ content: 'I do not have the `MANAGE_PERMISSIONS` permission required to use this command.' })
    }
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    if (channel.type !== 'GUILD_TEXT' || !channel) {
      return message.reply({ content: 'Please mention a valid channel or ID to lock.', allowedMentions: { repliedUser: false }})
    }
    const perm = channel.permissionOverwrites.cache.get(message.guild.id)
    if (perm && perm.deny.has(Permissions.FLAGS.SEND_MESSAGES)) {
      return message.reply({ content: 'This channel is already locked.', allowedMentions: { repliedUser: false }})
    }
    else {
      try {
        await channel.permissionOverwrites.edit(client.user, { 'SEND_MESSAGES': true })
        await channel.permissionOverwrites.edit(message.guild.id, { 'SEND_MESSAGES': false } )
        await message.reply({ content: 'Locked **#' + channel.name + '**', allowedMentions: { repliedUser: false }})
      }
      catch (error) {
        console.error(error)
        return message.reply({ content: 'I ran into an issue locking the channel. Please try again.', allowedMentions: { repliedUser: false }})
      }
    }
    
  }
}