const BaseCommand = require('../../utils/structures/BaseCommand');
const util = require('minecraft-server-util')
const Discord = require('discord.js')

module.exports = class MinecraftstatusCommand extends BaseCommand {
  constructor() {
    super('minecraftstatus', 'utility', ['mcs'], null, 'Gets status information regarding a Minecraft server.', 'minecraftstatus <IP> [port=25565]');
  }

  async run(client, message, args) {
    if (!args[0]) {
      return message.reply({ content: 'Please enter a valid IP.' })
    }
    let serverIP = [args[0], 25565]
    if (args[1]) {
      if (Number(args[1])) {
        serverIP[1] = Number(args[1])
      }
      else {
        return message.reply({ content: 'Please make sure your port number is correct and that it is a number.', allowedMentions: { repliedUser: false }})
      }
    }
    try {
      const response = await util.status(serverIP[0], { port: serverIP[1] })
      let playerList = []
      if (response.samplePlayers && response.samplePlayers.length !== 0) {
        response.samplePlayers.forEach(({ id, name }) => playerList.push(name))
        playerList = playerList.join('\n')
      } 
      else {
        playerList = '\n\n\n'
      }
      const serverinfo = new Discord.MessageEmbed()
        .setColor('#11D646')
        .setTitle('Server Status')
        .setThumbnail(client.user.displayAvatarURL())
        .addField('Server IP', '```' + response.host + '```')
        .addField('Server Port', '```' + response.port + '```')
        .addField('Server Version', '```' + response.version + '```')
        .addField('Players Online: ```' + response.onlinePlayers + '```', '```' + playerList + '```')
        .addField('Max Players', '```' + response.maxPlayers + '```')
      await message.reply({ embeds: [serverinfo] })
    }
    catch (error) {
      console.error(error)
      return message.reply({ content: 'I ran into an issue connecting to the server. Please check that it is online and that the IP and port are correct.' })      
    }
  }
}