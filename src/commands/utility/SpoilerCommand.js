const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const { Permissions } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class SpoilerCommand extends BaseCommand {
  constructor() {
    super('spoiler', 'utility', ['sp', 'spoil'], 2, 'Marks the text of a message, its images/videos, or both as a spoiler (at least one must be provided). Supports up to 10 images.', 'spoiler [text] [image]');
  }

  async run(client, message, args) {
    if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
      return message.reply({ content: 'I do not have the `MANAGE_WEBHOOKS` permission required to use this command.' , allowedMentions: { repliedUser: false }});
    }
    const webhook = await message.channel.createWebhook('Spoiler')
    const options = { username: message.author.username, avatarURL: message.author.displayAvatarURL({ dynamic: true }), files: [] }
    if (args.length > 0) {
      options.content = '|| ' + args.join(' ') + ' ||'
    }
    if (message.attachments.first()) {
      let processed = 0;
      message.attachments.each(async att => {
        const response = await fetch(att.proxyURL);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let temp = new Discord.MessageAttachment(buffer, 'SPOILER_' + att.name);
        options.files.push(temp);
        processed++;
        if (processed === message.attachments.size) {
          await message.delete();
          await webhook.send(options);
          return webhook.delete();
        }
      })
    }
    else {
      await message.delete();
      await webhook.send(options);
      return webhook.delete();      
    }
  }
}