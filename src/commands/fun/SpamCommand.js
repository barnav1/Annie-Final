const BaseCommand = require('../../utils/structures/BaseCommand');
const odm = require('../../odm.js');

module.exports = class SpamCommand extends BaseCommand {
  constructor() {
    super('spam', 'fun', ['s'], null, 'Repeatedly spams a given message for a certain duration. Only usable by the owner.', 'spam [#channel/ID] <time> <message>' );
  }

  async run(client, message, args) {
    //Permission Checking:
    if (message.author.id !== '393889222496616468') {
      return message.reply({ content: 'Imagine trying to copy a command after seeing someone else use it. Smh.', allowedMentions: { repliedUser: false }})
    }
    const time = odm.timeParse(args.slice(1).join(' '))
    const c = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
    if (!time) {
      return message.reply({ content: 'Please enter a valid time e.g. 5 minutes, 2m, 3h50m, 3 hours 2 minutes.', allowedMentions: { repliedUser: false }})
    }
    await c.send(time[1])
      .catch((error) => {
        console.error(error)
        return message.reply({ content: "I don't have permissions to send messages in that channel. Please check your server settings and try again." })
      })
    const intervalID = setInterval(async () => {
      await message.channel.send(time[1])
    }, 1200);

    setTimeout(() => {
      clearInterval(intervalID)
      return message.channel.send('Spam complete.')
    }, time[0])
  }
}