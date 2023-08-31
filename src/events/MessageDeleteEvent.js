// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
const Discord = require('discord.js');
const BaseEvent = require('../utils/structures/BaseEvent');
require('dotenv').config()
module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super('messageDelete');
  }
  
  async run(client, message) {
    if (!message.content) return;
    if (message.author.id === client.user.id) return;
    client.snipes.delete(message.channel.id)
    client.snipes.set(message.channel.id, message)

    //#region Message Logs
    const MessageLogs = ['801727638041395220', '878215231560622130', '626935318678863893']
    const MessageLogsChannels = ['875297742908428328', '878222402927075338', '889778501769654293']
    if (!MessageLogs.includes(message.guild.id)) return;
    if (MessageLogsChannels.includes(message.channel.id)) return;
    const deletedMessageLog = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor('#F75348')
      .setTitle('Message deleted in #' + message.channel.name)
      .setDescription(message.content)
      .setFooter(message.author.id)
      .setTimestamp();
    try {
      await message.guild.channels.cache.get(MessageLogsChannels[MessageLogs.indexOf(message.guild.id)]).send({ embeds: [deletedMessageLog] });
    }
    catch (error) {
      console.error(error);
    }
    //#endregion
  }
}