const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class GhostpingCommand extends BaseCommand {
  constructor() {
    super('ghostping', 'admin', ['gp'], null, 'Ghost pings @everyone in the mentioned channel. Only usable by the owner.', 'ghostping [#channel/ID]');
  }

  async run(client, message, args) {
    //Permission Checking:
    if (message.author.id !== "393889222496616468") return;
    
    //Variables
    let destinationChannel = message.mentions.channels.first()
    if (!destinationChannel) {
      destinationChannel = message.channel;
    }

    await message.delete();
    const msg = await destinationChannel.send("@everyone")
    setTimeout(async () => {
      await msg.delete();      
    }, 10);
    return
  }
}