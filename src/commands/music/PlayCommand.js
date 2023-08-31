const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js');
const Discord = require('discord.js');
const { Utils } = require('discord-music-player');
const odm = require('../../odm.js');

module.exports = class PlayCommand extends BaseCommand {
  constructor() {
    super('play', 'music', []);
  }

  async run(client, message, args) {
    if (!message.member.voice.channel) {
      return message.reply({ content: "You must be in a voice channel to use this command." })
    }
    else if (!message.guild.me.permissions.has(Permissions.FLAGS.CONNECT)) {
      return message.reply({ content: 'I do not have the `CONNECT` permission required to use this command.' })
    }
    else if (!message.guild.me.permissions.has(Permissions.FLAGS.SPEAK)) {
      return message.reply({ content: 'I do not have the `SPEAK` permission required to use this command.' })
    }
    let queue = client.player.getQueue(message.guild.id)
    let song;
    try {
      if (!queue) {
        queue = client.player.createQueue(message.guild.id);
      }
      else if (message.member.voice.channel.id !== queue.connection.channel.id) {
        return message.reply({ content: "You must be in the same voice channel as me to use this command." })
      }
      if (!args[0]) {
        if (!queue || queue.songs.length === 0) {
          return message.reply({ content: "There is currently nothing playing in this server." })
        }
        if (queue.connection.paused) {
          queue.setPaused(false)
          return message.reply({ content: "Queue resumed. :play_pause:" })
        }
        else {
          return message.reply({ content: "The queue is not paused." })
        }

      }
      await queue.join(message.member.voice.channel);
      song = await queue.play(args.join(' '), { requestedBy: message.author })
      if (queue.songs.indexOf(song) !== 0) {
        let timeUntilPlaying = 0
        for (let i = 0; i < queue.songs.length; i++) {
          if (i === 0) {
            timeUntilPlaying += Utils.timeToMs(queue.songs[i].duration) - queue.connection.time
          }
          else {
            timeUntilPlaying += Utils.timeToMs(queue.songs[i].duration)
          }
        }
        timeUntilPlaying = Utils.msToTime(timeUntilPlaying)
        if (timeUntilPlaying.slice(0, 1) === '0') {
          timeUntilPlaying = timeUntilPlaying.slice(1)
        }
        const embed = new Discord.MessageEmbed()
          .setAuthor('Song added to queue', message.author.displayAvatarURL({ dynamic: true }))
          .setTitle(song.name)
          .setURL(song.url)
          .setThumbnail(song.thumbnail)
          .setColor(odm.color)
          .addField('Song Duration', song.duration, true)
          .addField('Time until playing', timeUntilPlaying, true)
          .addField('Position in Queue', queue.songs.indexOf(song).toString(), true)
          .setFooter('Requested by ' + message.author.tag)
        return message.reply({ embeds: [embed] })

      }
      else {
        return message.reply({ content: 'Playing `' + song.name + '` in `#' + message.member.voice.channel.name + '`!' })
      }
    }
    catch (error) {
      if (!song) {
        return message.reply({ content: "I could not find a song called `" + args.join(' ') + "`." })
      }
      if (queue) {
        console.error(error)
        queue.connection.leave();
        client.player.deleteQueue(message.guild.id);
      }
    }
  }
}