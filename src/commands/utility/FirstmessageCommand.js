const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class FirstmessageCommand extends BaseCommand {
  constructor() {
    super('firstmessage', 'utility', ['first'], null, 'Retrieves the first message in a channel.', 'firstmessage [#channel/ID]');
  }

  async run(client, message, args) {
    let targetchannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    if (!args[0]) {
      targetchannel = message.channel;
    }
    else if (!targetchannel) {
      return message.reply({ content: 'Please mention a valid channel.', allowedMentions: { repliedUser: false }})
    }
    let fm;
    try {
      fm = await targetchannel.messages.fetch({ after: 0, limit: 1 })
    }
    catch (error) {
      console.error(error);
    }
    fm = fm.first()
    const member = fm.member
    const firstMessageEmbed = new Discord.MessageEmbed()
      .setAuthor(member.displayName, member.user.displayAvatarURL({ dyanmic: true }))
      .setColor(member.displayHexColor)
      .setDescription('[First Message in <#' + targetchannel.id + '>](' + fm.url + ')')
      .setFooter('Bot by xKWG.');
    return message.reply({ embeds: [firstMessageEmbed], allowedMentions: { repliedUser: false }})
  }
}
