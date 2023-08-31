const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js')

module.exports = class StealCommand extends BaseCommand {
  constructor() {
    super('steal', 'utility', ['addemoji', 'ae'], 5, 'Adds the given emoji to a server. You must have the Manage Emojis permission to use this command.', 'steal <emoji1> [emoji2]...[emojin]');
  }

  async run(client, message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
      return message.reply({ content: 'You do not have the `MANAGE_EMOJIS_AND_STICKERS` permission required to run this command.' })
    }
    args.forEach(async emoji => {
      let gif = false
      let id = []
      let emojiname = []
      if (emoji.startsWith('<a:')) {
        gif = true
        id = emoji.slice(3, -1)
      }
      else if (emoji.startsWith('<:')) {
        id = emoji.slice(2, -1)
      }
      else {
        return message.reply({ content: 'Please enter a valid emoji.' })
      }
      while (!Number(id)) {
        emojiname.push(id.slice(0,1))
        id = id.slice(1)
      }
      emojiname = emojiname.slice(0,-1).join('')
      let url = gif === true ? "https://cdn.discordapp.com/emojis/" + id + ".gif?v=1" : "https://cdn.discordapp.com/emojis/" + id + ".png?v=1"
      try {
        await message.guild.emojis.create(url, emojiname, { reason: 'Added by ' + message.author.tag + ' (ID: ' + message.author.id + ')'})
        await message.channel.send(emoji + ' emoji created')
      }
      catch (error) {
        console.error(error)
        return message.reply({ content: 'I ran into an issue adding those emojis. Please check that you have available emoji slots or try again.' })
      }
    });
  }
}