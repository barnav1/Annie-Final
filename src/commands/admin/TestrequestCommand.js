const Discord = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');
const odm = require('../../odm.js');

module.exports = class TestrequestCommand extends BaseCommand {
  constructor() {
    super('testrequest', 'admin', ['tr'], null, '???', '???');
  }

  async run(client, message, args) {
    if (message.author.id !== '393889222496616468') return;
    const reqChannel = client.channels.cache.get('861941818140393483')
    const testerRole = await message.guild.roles.fetch('842776022533668906')
    const candidateRole = await message.guild.roles.fetch('861923372446253067')
    const embed = new Discord.MessageEmbed()
      .setTitle('Tester Request!')
      .setColor('#1d4aa0')
      .setDescription('A tester is required to help out! If you are free, accept the request below!. The first person to do so will be given access. The request will be open for 5 minutes.')
      .setFooter('Thanks for your help!');
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('acceptRequest')
          .setLabel('Accept')
          .setStyle('SUCCESS')
          .setEmoji('✅')
      );
    const m = await reqChannel.send({ content: '<@&' + candidateRole.id + '>', embeds: [embed], components: [row] })
    const filter = interaction => interaction.customId === 'acceptRequest'
    const collector = m.createMessageComponentCollector({ filter, time: 300000, max: 1 })
    collector.on('collect', async interaction => {
      try {
        await interaction.deferUpdate();
        const member = await message.guild.members.fetch(interaction.user.id)
        await reqChannel.send({ content: '**' + member.user.tag + '** has been selected!' })
        await member.roles.add(testerRole)
        await interaction.followUp({ content: 'You have been selected to help test! Please make your way to <#824165641518579712>.', ephemeral: true })
      }
      catch (error) {
        console.error(error)
      }
    })
    collector.on('end', async () => {
      for (let i = 0; i < row.components.length; i++) {
        row.components[i] = row.components[i].setDisabled();
      }
      await m.edit({ components: [row] })
    })
  }
}