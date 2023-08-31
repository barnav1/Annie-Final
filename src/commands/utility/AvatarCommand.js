const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class AvatarCommand extends BaseCommand {
  constructor() {
    super('avatar', 'utility', ['av', 'pfp'], 2, 'Displays the profile picture (avatar) of the mentioned user, or the person who ran the command if no one is mentioned.', 'avatar [@user/ID]');
  }

  async run(client, message, args) {
    let target;
    if (Number(args[0])) {
      try {
        target = await message.guild.members.fetch(args[0])
      }
      catch (error) {
        console.error(error)
        target = message.member
      }
    }
    else {
      target = message.mentions.members.first() || message.member;
    }
    const url = target.user.displayAvatarURL({ dynamic: true, size: 4096 })
    const embed = new Discord.MessageEmbed()
      .setAuthor(target.user.tag, url)
      .setColor(target.displayHexColor)
      .setTitle('Avatar')
      .setImage(url)

    if (url.slice(0, -10).endsWith('.gif')) {
      embed.setDescription('Link as [png](' + target.user.displayAvatarURL({ format: 'png', size: 4096 }) + ')')                  
    }
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
  }
}