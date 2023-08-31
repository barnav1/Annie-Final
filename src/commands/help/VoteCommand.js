const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js');

module.exports = class VoteCommand extends BaseCommand {
  constructor() {
    super('vote', 'help', []);
  }

  async run(client, message, args) {
    const row = new Discord.MessageActionRow()
      .addComponents([
        new Discord.MessageButton()
          .setLabel('Top.gg')
          .setStyle('LINK')
          .setURL('https://top.gg/bot/823063174378029096/vote'),
        new Discord.MessageButton()
          .setLabel('dbl.com')
          .setStyle('LINK')
          .setURL('https://discordbotlist.com/bots/annie-leonhart/upvote')
      ]);
    const embed = new Discord.MessageEmbed()
      .setTitle('Vote for Annie Leonhart')
      .setColor(odm.color)
      .setThumbnail(client.user.displayAvatarURL())
      .addField('Perks', 'Access to the `bon` and `mudaeremind` commands')
      .setFooter('Thanks for voting!')
    return message.channel.send({ embeds: [embed], components: [row] })
  }
}