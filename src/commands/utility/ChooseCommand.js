const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class ChooseCommand extends BaseCommand {
  constructor() {
    super('choose', 'utility', [], null, 'Chooses one of the given arguments at random. Arguments must be separated by a comma.', 'choose <option1>, [option2],....[optionx]');
  }

  async run(client, message, args) {
    if (args.length === 0) {
      return message.reply({ content: 'Please provide some options to choose from.' })
    }
    args = args.filter(arg => arg !== '' && arg !== ' ').join(' ').split(',')
    if (args.length < 2) {
      return message.reply({ content: 'Please provide at least two options to choose from.'})
    }
    const randomNum = Math.floor(Math.random() * args.length)
    return message.reply({ content: args[randomNum], allowedMentions: { repliedUser: false }})
  }
}