const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RescueCommand extends BaseCommand {
  constructor() {
    super('rescue', 'utility', ['r'], 1, 'Deletes the message which calls the command. Useful for avoiding the `-snipe` command.', 'rescue');
  }

  async run(client, message, args) {
    return message.delete();
  }
}