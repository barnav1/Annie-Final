const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class EchoCommand extends BaseCommand {
  constructor() {
    super('echo', 'utility', [], null, 'Says a message in a given channel.', 'echo [#channel/ID] <message>');
  }

  async run(client, message, args) {
    //Permission Checking:
    if (message.author.id !== '393889222496616468') return;

    //Variables
    let messageToSay = args.slice(1).join(' ')
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    if (args[0] === 'r') {
      try {
        await channel.send({ content: args.slice(2).join(' '), reply: { messageReference: args[1] }});
        return
      }
      catch (error) {
        console.error(error)
      }
    }
    else if (!channel) {
      channel = message.channel
      messageToSay = args.join(' ')
    }
    try {
      await channel.send(messageToSay)
    }
    catch (error) {
      console.error(error);
    }
  }
}