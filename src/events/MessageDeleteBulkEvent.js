// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDeleteBulk
const Discord = require('discord.js');
const BaseEvent = require('../utils/structures/BaseEvent');
module.exports = class MessageDeleteBulkEvent extends BaseEvent {
  constructor() {
    super('messageDeleteBulk');
  }
  
  async run(client, messages) {
    //#region Message Logs
    const MessageLogs = ['801727638041395220', '878215231560622130', '626935318678863893']
    const MessageLogsChannels = ['875297742908428328', '878222402927075338', '889778501769654293']
    if (!MessageLogs.includes(messages.first().guild.id)) return;
    if (MessageLogsChannels.includes(messages.first().channel.id)) return;
    if (messages.size < 2) return;
    if (!messages.first()) return;
    let str = ''
    let counter = 0
    messages.each(m => {
      const addNewLine = (text) => text + '[' + m.author.tag + ']: ' + m.content + '\n'
      if (addNewLine(str).length > 300) return;
      if (m.content) {
        str = addNewLine(str)
      }
      counter = counter + 1        
    })
    const embed = new Discord.MessageEmbed()
      .setTitle(messages.size.toString() + ' messages purged in #' + messages.first().channel.name)
      .setColor('#F75348')
      .setDescription(str)
      .setFooter(counter.toString() + ' messages displayed')
      .setTimestamp(messages.first().deletedTimestamp)
    try {
      await messages.first().guild.channels.cache.get(MessageLogsChannels[MessageLogs.indexOf(messages.first().guild.id)]).send({ embeds: [embed] });
    }
    catch (error) {
      console.error(error);
    }
    //#endregion
  }
}