const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class PauseCommand extends BaseCommand {
  constructor() {
    super('pause', 'music', []);
  }

  async run(client, message, args) {
    const queue = client.player.getQueue(message.guild.id)
    if (!queue || queue.songs.length === 0) {
      return message.reply({ content: 'There is currently nothing playing in this server.' })
    }
    if (!message.member.voice.channel || message.member.voice.channel.id !== queue.connection.channel.id) {
      return message.reply({ content: 'You must be in the same voice channel as me to use this command.' })
    }
    if (queue.connection.paused) {
      return message.reply({ content: "The queue is already paused." })
    }
    queue.setPaused(true)
    return message.reply({ content: "Queue paused. :play_pause: " })
  }
}