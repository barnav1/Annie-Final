const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class PingCommand extends BaseCommand {
  constructor() {
    super('ping', 'utility', [], 5, 'Shows latency stats for the bot.', 'ping');
  }

  async run(client, message, args) {
    try {
      const m = await message.reply({ content: `Pinging...` })
      const botLatency = Math.round(m.createdTimestamp - message.createdTimestamp)
      const apiLatency = Math.round(client.ws.ping)
      const pongEmbed = new Discord.MessageEmbed()
        .setColor('#D93870')
        .setTitle('Pong! :ping_pong:')
        .setDescription('My Latency: ' + botLatency + ' ms. \nAPI Latency: ' + apiLatency + ' ms.')
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
      await m.edit({ content: ' ', embeds: [pongEmbed] })
    }
    catch (error) {
      console.error(error);
    }
  }
}