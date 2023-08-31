const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js');

module.exports = class NowplayingCommand extends BaseCommand {
  constructor() {
    super('nowplaying', 'music', ['np', 'current']);
  }

  async run(client, message, args) {
    const queue = client.player.getQueue(message.guild.id)
    if (!queue || queue.songs.length === 0) {
      return message.reply({ content: "There is currently nothing playing in this server." })
    }
    const progressBar = queue.createProgressBar()
    if (progressBar.times.slice(0, 1) === '0') {
      progressBar.times = progressBar.times.slice(1)
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor('Now Playing in ' + message.guild.name, client.user.displayAvatarURL())
      .setTitle(queue.nowPlaying.name)
      .setURL(queue.nowPlaying.url)
      .setColor(odm.color)
      .setThumbnail(queue.nowPlaying.thumbnail)
      .setDescription('```[' + progressBar.bar + ']\n[' + progressBar.times + ']```')
    return message.reply({ embeds: [embed] })
  }
}