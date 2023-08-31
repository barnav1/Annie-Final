const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js');

module.exports = class QueueCommand extends BaseCommand {
  constructor() {
    super('queue', 'music', []);
  }

  async run(client, message, args) {
    if (!client.player.hasQueue(message.guild.id)) {
      return message.reply({ content: 'There is currently nothing playing in this server.' })
    }
    const queue = client.player.getQueue(message.guild.id)
    let str = 'Queue empty.'
    if (!args[0]) {
      if (queue.songs.length > 0) {
        str = '**__Now Playing:__**\n[' + queue.nowPlaying.name + '](' + queue.nowPlaying.url + ') | `Duration: ' + queue.nowPlaying.duration + ' Requested by: ' + queue.nowPlaying.requestedBy.tag + '`'
        if (queue.songs.length > 1) {
          str = str + '\n\n__Up Next:__\n'
        }
        for (let i = 1; i < queue.songs.length; i++) {
          str = str + '[' + i.toString() +  '. ' + queue.songs[i].name + '](' + queue.songs[i].url + ') | `Duration: ' + queue.songs[i].duration + ' Requested by: ' + queue.songs[i].requestedBy.tag + '`\n\n'
        }
      }
      const embed = new Discord.MessageEmbed()
        .setAuthor('Queue for ' + message.guild.name, client.user.displayAvatarURL())
        .setThumbnail(message.guild.iconURL())
        .setDescription(str)
        .setColor(odm.color)
      return message.channel.send({ embeds: [embed] })
    }
    else {
      if (!message.member.voice.channel || message.member.voice.channel.id !== queue.connection.channel.id) {
        return message.reply({ content: 'You must be in the same voice channel as me to use this command.' })
      }
      if (args[0] === 'clear') {
        queue.setPaused();
        queue.clearQueue();
        return message.reply({ content: "Cleared the queue.", allowedMentions: { repliedUser: true }})      
      }
      else if (args[0] === 'loop') {
        if (queue.repeatMode === 2) {
          queue.setRepeatMode(0)
          return message.reply({ content: "Disabled the queue loop.", allowedMentions: { repliedUser: true }})
        }
        else {
          queue.setRepeatMode(2)
          return message.reply({ content: "Looped the queue! 🔁", allowedMentions: { repliedUser: true }})
        }
      }
      else if (args[0] === "move") {
        if (!parseInt(args[1]) || !parseInt(args[2])) {
          return message.reply({ content: "Please enter valid queue positions." })
        }
        const positions = [parseInt(args[1]), parseInt(args[2])]
        if (positions.some(n => n < 1 || n > queue.songs.length)) {
          return message.reply({ content: "Please enter valid queue positions." })          
        }
        let temp = queue.songs[positions[0]]
        queue.songs.splice(positions[0], 1)
        queue.songs.splice(positions[1], 0, temp)
        return message.reply({content: "Moved `" + temp.name + "` to position " + positions[1] + ' in the queue.' })
      }
    }
  }
}