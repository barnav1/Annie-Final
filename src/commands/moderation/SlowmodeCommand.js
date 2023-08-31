const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js');
const odm = require('../../odm.js')

module.exports = class SlowmodeCommand extends BaseCommand {
  constructor() {
    super('slowmode', 'moderation', ['sm'], 5, 'Puts a slowmode on a given channel.', 'slowmode [time=0]');
  }

  async run(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || !message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return message.reply({ content: 'You do not have the `MANAGE_MESSAGES` permission required to use this command.' })
    }
    else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return message.reply({ content: 'I do not have the `MANAGE_CHANNELS` permission required to use this command.' })
    }
    if (!args[0]) {
      if (message.channel.rateLimitPerUser === 0) {
        return message.reply({ content: 'Please specify a duration for the slowmode.', allowedMentions: { repliedUser: false }})
      }
      try {
        await message.channel.setRateLimitPerUser(0, 'Requested by ' + message.author.tag)
        return message.reply({ content: 'Slowmode removed from <#' + message.channel.id + '>.', allowedMentions: { repliedUser: false }})
      }
      catch (error) {
        console.error(error)
        return message.reply({ content: 'I ran into an issue removing the slowmode. Please try again.' })        
      }
    }
    const time = Math.floor(odm.timeParse(args.join(' '))[0] / 1000)
    if (!Number(time)) {
      return message.reply({ content: 'Please enter a valid time e.g. 5 minutes, 2m, 3h50m, 3 hours 2 minutes.', allowedMentions: { repliedUser: false }})
    }
    else if (time > 21600) {
      return message.reply({ content: 'Please enter a duration shorter than 6 hours.', allowedMentions: { repliedUser: false }})
    }
    try {
      await message.channel.setRateLimitPerUser(time, 'Requested by ' + message.author.tag)
      return message.reply({ content: 'Slowmode set as ' + odm.msParse(time * 1000, 5) + '.' })
    }
    catch (error) {
      console.error(error)
      return message.reply({ content: 'I ran into an issue setting the slowmode. Please try again.' })
    }
  }
}