const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js');
const moment = require('moment');

module.exports = class GohanCommand extends BaseCommand {
  constructor() {
    super('gohan', 'admin', []);
  }

  async run(client, message, args) {
    if (!['757346743598710866', '479298134275653632', '824159759041167390'].includes(message.guild.id)) return;
    const now = new Date()
    let monthdiff = moment(Date.now()).diff(moment(1634223960000), 'months')
    if (monthdiff === 1) {
      monthdiff = monthdiff + ' month'
    }
    else {
      monthdiff = monthdiff + ' months'
    }
    const thisMonthEq = new Date(1634223960000)
    thisMonthEq.setFullYear(now.getFullYear())
    thisMonthEq.setMonth(now.getMonth())
    if (Date.now() - thisMonthEq.getTime() < 0) {
      thisMonthEq.setMonth(now.getMonth() - 1)
      if (now.getMonth - 1 < 0) {
        thisMonthEq.setMonth(now.getMonth() - 1 + 12)
        thisMonthEq.setFullYear(now.getFullYear() - 1)
      }
    }
    const timeString = monthdiff + ', ' + odm.msParse(Date.now() - thisMonthEq.getTime(), 2) 
    const embed = new Discord.MessageEmbed()
      .setColor(odm.color)
      .setDescription(timeString);
    
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('smirk')
          .setEmoji('😏')
          .setStyle('SECONDARY')
      );
    await message.delete();
    const m = await message.channel.send({ embeds: [embed], components: [row] })
    const filter = interaction => interaction.customId === 'smirk'
    const collector = m.createMessageComponentCollector({ filter: filter, time: 20000 })
    collector.on('collect', async interaction => {
      await interaction.deferUpdate();
      return interaction.followUp({ content: 'You have successfully smirked. https://tenor.com/view/gohan-mystic-gif-18506474 ', ephemeral: true })
    })
    collector.on('end', async () => {
      for (let i = 0; i < row.components.length; i++) {
        row.components[i] = row.components[i].setDisabled();
      }
      await m.edit({ components: [row] })
    })
  }
}