const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class DisplaycolorCommand extends BaseCommand {
  constructor() {
    super('displaycolor', 'fun', ['displaycolour'], 15, 'Allows you to change the color of your highest role if it is unique to you. Returns your display color if nothing is specified.', 'displaycolor [hexcode]');
  }

  async run(client, message, args) {
    if (message.guild.id !== '757346743598710866') return;
    
    const highestRole = message.member.roles.highest
    const hexcode = new RegExp(/^#(?:[a-fA-F0-9]{6})/ig)
    if (!args[0]) {
      const color = new Discord.MessageEmbed()
        .setTitle('Role Color')
        .setColor(highestRole.hexColor)
        .setDescription('The <@&' + highestRole.id + '> role has the color ' + highestRole.hexColor.toUpperCase())
        .setFooter('Bot by xKWG.')
      return message.reply({ embeds: [color] })
    }
    if (highestRole.members.size !== 1) {
      return message.reply({ content: "You cannot modify this role as it is not unique to you." })
    }
    if (!hexcode.test(args[0])) {
      return message.reply({ content: 'Please enter a valid hex code.' })
    }
    await highestRole.setColor(args[0])
      .then((role) => {
        const embed = new Discord.MessageEmbed()
          .setTitle('Color Changed!')
          .setColor(args[0])
          .setDescription('<@&' + role.id + '> role color changed to ' + role.hexColor.toUpperCase())
          .setFooter('Bot by xKWG.')
        return message.reply({ embeds: [embed] })
      })
      .catch(error => {
        console.error(error)
        return message.reply({ content: "I was unable to change the role's color. Please try again." })
      })
  }
}