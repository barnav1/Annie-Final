const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');

module.exports = class SnipeCommand extends BaseCommand {
  constructor() {
    super('snipe', 'fun', [], null, 'Retrives the last deleted message in a channel.', 'snipe');
  }

  async run(client, message, args) {
    const msg = client.snipes.get(message.channel.id)
    if (!msg || msg.author.id === '393889222496616468') {
      return message.reply({ content: "The message you are trying to snipe does not exist. Just like your life." })
    }
    else {
      const snipeEmbed = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setColor(msg.member.roles.highest.hexColor)
        .setDescription(msg.content)
        .setFooter("Sniped by " + message.author.tag)
        .setTimestamp(msg.createdTimestamp);
      if (msg.attachments.first()) {
        snipeEmbed.setImage(msg.attachments.first().proxyURL)
      }
      return message.reply({ embeds: [snipeEmbed] })
    }
  }
}