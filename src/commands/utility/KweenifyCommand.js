const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class KweenifyCommand extends BaseCommand {
  constructor() {
    super('kweenify', 'Utility', ['kw'], null, 'Kweenifies the given text. Only usable by tulaii and the owner.', 'kweenify <message>');
  }

  async run(client, message, args) {
    if (!args[0]) {
      return message.reply({ content: 'Please enter something to kweenify.', allowedMentions: { repliedUser: false }})
    }
    await message.delete();
    return message.channel.send("**✧･ﾟ:*** " + args.join(' ') + " **✧･ﾟ:***");
    
 }}