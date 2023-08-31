const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js');

module.exports = class UnlockdownCommand extends BaseCommand {
  constructor() {
    super('unlockdown', 'moderation', ['unlock', 'ul'], null, 'Unlocks the channel so that @everyone can send messages there. You must have the Manage Permissions permission to use this command.', 'unlockdown [#channel/ID]');
  }

  async run(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return message.reply({ content: 'You do not have the `MANAGE_PERMISSIONS` permission required to use this command.' })
    }
    else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return message.reply({ content: 'I do not have the `MANAGE_PERMISSIONS` permission required to use this command.' })
    }
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return message.reply({ content: 'Please mention a valid channel or ID to lock.', allowedMentions: { repliedUser: false }})
    }
    const perm = await channel.permissionOverwrites.cache.get(message.guild.id)
    if (perm && !perm.deny.has(Permissions.FLAGS.SEND_MESSAGES) && !perm.allow.has(Permissions.FLAGS.SEND_MESSAGES)) {
      return message.reply({ content: 'This channel is already unlocked.' })
    }
    else {
      try {
        await channel.permissionOverwrites.edit(message.guild.id, { 'SEND_MESSAGES': null } )
        await message.reply({ content: 'Unlocked **#' + channel.name + '**', allowedMentions: { repliedUser: false }})
      }
      catch (error) {
        console.error(error)
        return message.reply({ content: 'I ran into an issue locking the channel. Please try again.' })
      }
    }
    
  }
}