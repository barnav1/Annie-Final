const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js');
const Discord = require('discord.js');

module.exports = class JoinCommand extends BaseCommand {
  constructor() {
    super('join', 'music', []);
  }

  async run(client, message, args) {
    if (!message.member.voice.channel) {
      return message.reply({ content: "You must be in a voice channel to use this command." })
    }
    if (!message.guild.me.voice.channel) {
    }
    else if (message.guild.me.voice.channel.id === message.member.voice.channel.id) {
      return message.reply({content: "I am already in your voice channel." })
    }
    let queue = client.player.getQueue(message.guild.id)
    try {
      if (!queue) {
        queue = client.player.createQueue(message.guild.id);
      }
      await queue.join(message.member.voice.channel);
      return message.reply({ content: 'Joined `#' + message.member.voice.channel.name + '`.' })
    }
    catch (error) {
      console.error(error)
      if (queue) {
        queue.connection.leave();
        client.player.deleteQueue(message.guild.id);
      }
    }
  }
}