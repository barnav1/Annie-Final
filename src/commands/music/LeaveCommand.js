const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class LeaveCommand extends BaseCommand {
  constructor() {
    super('leave', 'music', ['dc', 'disconnect']);
  }

  async run(client, message, args) {
    const queue = client.player.getQueue(message.guild.id)
    if (!queue) {
      if (message.guild.me.voice.channel) {
        try {
          let c = message.guild.me.voice.channel
          await message.guild.me.voice.disconnect();
          return message.reply({ content: "Disconnected from `#" + c.name + "`." })
        }
        catch (error) {
          console.error(error);
        }
      }
      else {
        return message.reply({ content: 'There is currently nothing playing in this server.' })
      }
    }
    if (!message.member.voice.channel || message.member.voice.channel.id !== queue.connection.channel.id) {
      return message.reply({ content: 'You must be in the same voice channel as me to use this command.' })
    }
    const c = queue.connection.channel
    queue.connection.leave();
    client.player.deleteQueue(message.guild.id);
    return message.reply({ content: "Disconnected from `#" + c.name + "`." })
  }
}