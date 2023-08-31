const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js')

module.exports = class StompCommand extends BaseCommand {
  constructor() {
    super('stomp', 'admin', [], null, 'Stomps the mentioned user. You must have the Administrator permission to use this command.', 'stomp [@user/ID]');
  }

  async run(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return message.reply({ content: "Your foot does not have enough power to stomp on someone." })
    }
    let target;
    if (Number(args[0])) {
      try {
        target = await message.guild.members.fetch(args[0])
      }
      catch (error) {
        console.error(error)
        return message.channel.send('Nice. You stomped yourself.')
      }
    }
    else {
      target = message.mentions.members.first() || message.member;
    }
    target = target.user
    if (target.id === '823063174378029096') {
      return message.reply({ content: "No. :raised_hand: Only Armin can stomp on me. :smirk:" })
    }
    else if (target.id == "393889222496616468") return;
    if (target = message.author) {
      return message.reply({ content: "Nice. You stomped yourself.", allowedMentions: { repliedUser: true }});
    }
    await message.delete();
    return message.channel.send("<@" + target.id + "> " + "ₕₐₛ bₑₑₙ ₛₜₒₘₚₑd.");
  }
}