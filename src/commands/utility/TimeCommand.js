const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class TimeCommand extends BaseCommand {
  constructor() {
    super('time', 'utility', ['t'], 5, 'Shows the time in the United Kingdom and India.', 'time');
  }

  async run(client, message, args) {
    const uktime = new Date(Date.now() + 3600000)
    const indiatime = new Date(Date.now() + 19800000)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeEmbed = new Discord.MessageEmbed()
        .setColor('#6C00BA')
        .setTitle(':clock1:')
        .addField(":flag_in: India Time (IST, GMT+5:30)", indiatime.toLocaleDateString('en-US', options) + "\n`" + (indiatime.toLocaleTimeString('en-US').length === 10 ? '0' + indiatime.toLocaleTimeString('en-US') : indiatime.toLocaleTimeString('en-US')) + '`')
        .addField(":flag_gb: UK Time (BST, GMT+1)", uktime.toLocaleDateString('en-US', options) + "\n`" + (uktime.toLocaleTimeString('en-US').length === 10 ? '0' + uktime.toLocaleTimeString('en-US') : uktime.toLocaleTimeString('en-US')) + '`')
        .setFooter("Used by " + message.author.tag, message.author.displayAvatarURL())
    return message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false }})
  }
}