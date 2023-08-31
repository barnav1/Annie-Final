const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RemoveCommand extends BaseCommand {
  constructor() {
    super('remove', 'music', []);
  }

  async run(client, message, args) {
    const queue = client.player.getQueue(message.guild.id)
    if (!queue || queue.songs.length === 0) {
      return message.reply({ content: 'There is currently nothing playing in this server.' })
    }
    if (!message.member.voice.channel || message.member.voice.channel.id !== queue.connection.channel.id) {
      return message.reply({ content: 'You must be in the same voice channel as me to use this command.' })
    }
    if (!parseInt(args[0]) || parseInt(args[0]) + 1 > queue.songs.length || parseInt(args[0]) < 1) {
      return message.reply({ content: "Please enter a valid queue position to remove." })
    }
    const removed = queue.remove(parseInt(args[0]))
    return message.reply({ content: "Removed `" + removed.name + "` from the queue." })
  }
}