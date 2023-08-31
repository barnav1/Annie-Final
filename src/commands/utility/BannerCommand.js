const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = class BannerCommand extends BaseCommand {
  constructor() {
    super('banner', 'utility', []);
  }

  async run(client, message, args) {
    let target;
    if (Number(args[0])) {
      try {
        target = await message.guild.members.fetch(args[0])
      }
      catch (error) {
        console.error(error)
        target = message.member
      }
    }
    else {
      target = message.mentions.members.first() || message.member;
    }
    let userFetch;
    try {
      const API = await fetch('https://discord.com/api/users/' + target.id, { 
        method: 'GET',
        headers: { "Authorization": "Bot " + client.token }
      })
      userFetch = await API.json()
    }
    catch (error) {
      console.error(error)
    }
    const bannerHash = userFetch["banner"]
    if (!bannerHash) {
      return message.reply({ content: "You do not have a custom banner.", allowedMentions: { repliedUser: false }})
    }
    let URL = 'https://cdn.discordapp.com/banners/' + target.id + '/' + bannerHash
    if (bannerHash.startsWith('a_')) {
      URL = URL + '.gif'
    }
    else {
      URL = URL + '.png'
    }
    URL = URL + '?size=4096'
    const embed = new Discord.MessageEmbed()
      .setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setColor(target.displayHexColor)
      .setTitle('Banner')
      .setImage(URL)

    if (bannerHash.startsWith("a_")) {
      embed.setDescription('Link as [png](' + URL.slice(0, -14) + '.png?size=4096' + ')')                  
    }
      return message.reply({ embeds: [embed] })
    
  }
}