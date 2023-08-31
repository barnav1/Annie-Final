const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js')
require('dotenv').config();

module.exports = class PromoteCommand extends BaseCommand {
  constructor() {
    super('promote', 'admin', []);
  }

  async run(client, message, args) {
    if (message.author.id !== process.env.OWNERID) return;
    if (message.guild.id !== '824159759041167390') return;
    let member;
    if (Number(args[0])) {
      try {
        member = await message.guild.members.fetch(args[0])
      }
      catch (error) {
        console.error(error)
        member = message.member
      }
    }
    else {
      member = message.mentions.members.first() || message.member;
    }
    const roles = ['852517216083116065', '861923564700827659', '844941936590454845', '870235526865764393', '861923646687281163']
    const promotionChannel = await message.guild.channels.fetch('871409885814878259')
    for (let i = 0; i < roles.length; i++) {
      roles[i] = await message.guild.roles.fetch(roles[i])
    }
    let current = roles.find(r => member.roles.cache.has(r.id))
    if (!current) {
      current = await message.guild.roles.fetch('881141985111592970')
    }
    let promote = message.mentions.roles.first() || roles[roles.indexOf(current) + 1]
    if (!current && !promote) {
      promote = roles[0]
    }
    else if (!promote) {
      return message.reply({ content: 'This member is already a god.', allowedMentions: { repliedUser: false }})
    }
    if (current) {
      await member.roles.remove(current)
    }
    await member.roles.add(promote)
    const embed = new Discord.MessageEmbed()
      .setTitle('New Promotion!')
      .setDescription('**User:** <@' + member.id + '>\n**Promotion:** <@&' + current.id + '> → <@&' + promote.id + '>')
      .setColor(odm.color)
      .setFooter('Thanks for helping!')
      .setTimestamp();
    return promotionChannel.send({ embeds: [embed] });
  }
}