const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class SupportCommand extends BaseCommand {
  constructor() {
    super('supportserver', 'help', ['server', 'support', 'ss'], 10, 'Sends the invite link to the Annie Leonhart support server.', 'support');
  }

  async run(client, message, args) {
    const embed = new Discord.MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setColor('#7283F2')
      .setDescription('Need help with the bot? Have an idea for the bot that you want to be added? Join the Annie Leonhart support server and stay up to date with the latest bot updates [here](https://discord.gg/m5A2RbVGHM).')
      .setFooter('Bot by xkWG.')
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setLabel('Support')
          .setStyle('LINK')
          .setURL('https://discord.gg/qDPSXHwRdQ')
      );
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }})
  }
}