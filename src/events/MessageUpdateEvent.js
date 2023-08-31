// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-oldMessageUpdate
const Discord = require('discord.js')
const odm = require('../odm.js');
const BaseEvent = require('../utils/structures/BaseEvent');
require('dotenv').config()
module.exports = class MessageUodateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(client, oldMessage, newMessage) {
    if (oldMessage.content === newMessage.content) return;
    if (!newMessage.content) return;
    if (oldMessage.author.id === client.user.id) return;
    client.editsnipes.delete(oldMessage.channel.id)
    client.editsnipes.set(oldMessage.channel.id, oldMessage)
    //#region Message Logs
    const MessageLogs = ['801727638041395220', '878215231560622130', '626935318678863893']
    const MessageLogsChannels = ['875297742908428328', '878222402927075338', '889778501769654293']
    if (!MessageLogs.includes(newMessage.guild.id)) return;
    if (MessageLogsChannels.includes(newMessage.channel.id)) return;
    const editedMessageLog = new Discord.MessageEmbed()
      .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL())
      .setColor(odm.color)
      .setTitle('Message edited in #' + oldMessage.channel.name)
      .setDescription('**Original:**\n' + oldMessage.content + '\n\n**Edited:**\n' + newMessage.content)
      .setFooter(oldMessage.author.id)
      .setTimestamp();
    try {
      await oldMessage.guild.channels.cache.get(MessageLogsChannels[MessageLogs.indexOf(oldMessage.guild.id)]).send({ embeds: [editedMessageLog] });
    }
    catch (error) {
      console.error(error);
    }
    //#endregion

  }
}