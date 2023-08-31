const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js');

module.exports = class PerksCommand extends BaseCommand {
  constructor() {
    super('perks', 'utility', [], null, 'Details the perks for the weekly warrior system in the Subject Zero guild.', 'perks');
  }

  async run(client, message, args) {
    if (message.guild.id !== '757346743598710866') return;
    const embed = new Discord.MessageEmbed()
      .setTitle('SZ Activity perks')
      .setThumbnail("https://cdn.discordapp.com/attachments/665908573783457795/819819075714154536/server_icon_min.gif")
      .setColor(odm.color)
      .setDescription("The member with the most activity in a one week period will receive the following:\n\n-The exclusive <@&819819395680436265> role\n-Access to <#811134171262353438>\n-Permissions to use the -bon command\n-**A custom AR for your name**\n-An AR, or autoreaction, makes it so that whenever you get pinged, the bot reacts to the message that pinged you with an emoji of your choice.\n-420 chez on the <@270904126974590976> bot.\n-Permissions to add emojis.")
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }})
  }
}