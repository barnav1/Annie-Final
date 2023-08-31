const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class Play21Command extends BaseCommand {
  constructor() {
    super('play21', 'fun', ['21'], '');
  }

  async run(client, message, args) {
    if (client.ongoingEvents.some(c => client.channels.cache.get(c.id).guildId === message.guild.id)) {
      return message.reply({ content: 'There is already a game of 21 going on in this server. Please try again after some time.', allowedMentions: { repliedUser: true }});
    }       
    else {
      let x = client.ongoingEvents.get(message.channel.id)
      if (x) {
        x.push(['21'])
      }
      else {
        x = ['21']
      }
      client.ongoingEvents.set(message.channel.id, x)
    }
    if (args[0] === 'start') {
      const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('join21Game')
          .setLabel('Join Game')
          .setStyle('SUCCESS')
          .setEmoji('✅')
      );
    }
  }
}