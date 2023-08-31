const BaseCommand = require('../../utils/structures/BaseCommand');
const { Utils } = require('discord-music-player');

module.exports = class SeekCommand extends BaseCommand {
  constructor() {
    super('seek', 'music', []);
  }

  async run(client, message, args) {
    const queue = client.player.getQueue(message.guild.id)
    if (!queue || queue.songs.length === 0) {
      return message.reply({ content: 'There is currently nothing playing in this server.' })
    }
    if (!message.member.voice.channel || message.member.voice.channel.id !== queue.connection.channel.id) {
      return message.reply({ content: 'You must be in the same voice channel as me to use this command.' })
    }
    const length = Utils.timeToMs(args[0])
    if (!length) {
      return message.reply({ content: "Please enter a valid timestamp." })
    }
    if (length < 0 || length > Utils.timeToMs(queue.nowPlaying.duration)) {
      return message.reply({ content: "The timestamp mentioned must be within the current song." })
    }
    queue.seek(length)
  }
}