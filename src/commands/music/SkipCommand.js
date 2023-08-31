const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class SkipCommand extends BaseCommand {
  constructor() {
    super('skip', 'music', []);
  }

  async run(client, message, args) {
    const queue = client.player.getQueue(message.guild.id)
    if (!queue || queue.songs.length === 0) {
      return message.reply({ content: 'There is currently nothing playing in this server.' })
    }
    if (!message.member.voice.channel || message.member.voice.channel.id !== queue.connection.channel.id) {
      return message.reply({ content: 'You must be in the same voice channel as me to use this command.' })
    }
    const skipped = queue.skip()
    if (skipped.url === queue.nowPlaying.url && queue.songs.length === 1) {
      queue.stop();
    }
    return message.reply({ content: 'Skipped **`' + skipped.name + '`**' })
  }
}