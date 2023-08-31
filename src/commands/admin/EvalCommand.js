const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js');
require('dotenv').config();

module.exports = class EvalCommand extends BaseCommand {
  constructor() {
    super('eval', 'admin', [], null, 'Evaluates a line of code. Only usable by the bot owner.', 'eval <code>');
  }

  async run(client, message, args) {
    if (message.author.id !== process.env.OWNERID) {
      const m = await message.reply({ content: 'You are not the owner smh.', allowedMentions: { repliedUser: false }})
      setTimeout(() => {
        m.delete();
      }, 5000)
      return
    }
    if(!args[0]) {
      const m2 = await message.reply({ content: 'You need to input some code to evaluate.', allowedMentions: { repliedUser: false }})
      setTimeout(() => {
        m2.delete();
      }, 3000)
      return
    }
    const channelId = ['866219522871787540', '880646041895075850']
    try {
      if (args.join(" ").toLowerCase().includes("token")) {
        return;
      }
      const toEval = args.join(" ");
      const evaled = await eval(toEval);
      return message.reply({ content: '```js\n' + evaled.toString() + '```', allowedMentions: { repliedUser: false }})
    }
    catch (error) {
      console.error(error)
      const errorEmbed = new Discord.MessageEmbed()
        .setTitle('Error! :warning:')
        .setColor(odm.color)
        .setDescription('**Command:** eval\nServer: ' + message.guild.name + ' (' + message.guild.id + ')\nChannel: #' + message.channel.name + ' (' + message.channel.id + ')\nRun by: ' + message.author.id + ' (<@' + message.author.id + '>)\n```' + error.stack.toString() + '```')
        .setTimestamp();
      await client.channels.cache.get(channelId[1]).send({ embeds: [errorEmbed] });
      return message.reply({ content: '```js\n' + error.stack.toString() + '```', allowedMentions: { repliedUser: false }})
    }
  }
}