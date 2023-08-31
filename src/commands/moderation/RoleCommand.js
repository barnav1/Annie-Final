const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class RoleCommand extends BaseCommand {
  constructor() {
    super('role', 'moderation', []);
  }

  async run(client, message, args) {
    message.channel.send('role command works');
  }
}