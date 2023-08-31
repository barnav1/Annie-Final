const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class FamilytreeCommand extends BaseCommand {
  constructor() {
    super('familytree', 'utility', ['ft'], null, 'Sends the Subject Zero family tree. Only usable in the Subject Zero guild.', 'familytree');
  }

  async run(client, message, args) {
    if (message.guild.id !== '757346743598710866') return;
    return message.reply({ content: 'https://cdn.discordapp.com/attachments/665908573783457795/844267469497827348/Family_Tree.png', allowedMentions: { repliedUser: false }});
  }
}