const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = class UserinfoCommand extends BaseCommand {
  constructor() {
    super('userinfo', 'utility', ['ui'], 5, 'Returns information about a given user.', 'userinfo [@user/ID]');
  }

  async run(client, message, args) {
    let m;
    if (Number(args[0])) {
      try {
        m = await message.guild.members.fetch(args[0])
      }
      catch (error) {
        console.error(error)
        m = message.member
      }
    }
    else {
      m = message.mentions.members.first() || message.member;
    }
    let rolestring = []
    //#region Banner URL
    let userFetch;
    try {
      const API = await fetch('https://discord.com/api/users/' + m.id, { 
        method: 'GET',
        headers: { "Authorization": "Bot " + client.token }
      })
      userFetch = await API.json()
    }
    catch (error) {
      console.error(error)
    }
    const bannerHash = userFetch["banner"]
    let URL = null
    if (!bannerHash) {

    }
    else if (bannerHash.startsWith('a_')) {
      URL = 'https://cdn.discordapp.com/banners/' + m.id + '/' + bannerHash + '.gif?size=4096'
    }
    else {
      URL = 'https://cdn.discordapp.com/banners/' + m.id + '/' + bannerHash + '.png?size=4096'
    }
    console.log(URL)  
    //#endregion
    m.roles.cache.filter(role => role.id !== message.guild.id).each(async role => {
      rolestring.push('<@&' + role.id + '>')   
    })
    rolestring = rolestring.join(", ")
    let perms = m.permissions.toArray()
    let permstring = []
    const filter = ["Administrator", "Manage Server", "Manage Roles", "Manage Channels", "Manage Messages", "Manage Webhooks", "Manage Nicknames", "Manage Emojis", "Kick Members", "Ban Members", "Mention Everyone", "View Audit Log", "Move Members"]
    perms.forEach(perm => {
      perm = perm
        .replace(/_/gi, " ")
        .split(/\s+/)
      for (let i = 0; i < perm.length; i++) {
        perm[i] = perm[i].slice(0, 1).toUpperCase() + perm[i].slice(1).toLowerCase()
      }
      perm = perm === "Manage Guild" ? "Manage Server" : perm
      permstring.push(perm.join(" "))
    });
    let temp = new Date(m.user.createdTimestamp)
    let temp2 = new Date(m.joinedTimestamp)
    permstring = permstring.filter(perm => filter.includes(perm)).sort().join(", ")
    function daysAgo(ms) {
      let daysAgo = Math.floor(ms / (1000 * 60 * 60 * 24))
      return daysAgo.toString()
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(m.nickname ? m.user.username + ' - ' + m.nickname : m.user.username)
      .addField("Account Created:", temp.toLocaleDateString({ timeZone: 'UTC' }).replace(/\//gi, "-") + ' ' + temp.toLocaleTimeString('en-GB', { timeZone: 'UTC'}) + ' UTC (' + daysAgo(Date.now() - temp.getTime()) + ' days ago)', true)
      .addField("Joined at:", temp2.toLocaleDateString({ timeZone: 'UTC' }).replace(/\//gi, "-") + ' ' + temp2.toLocaleTimeString('en-GB', { timeZone: 'UTC'}) + ' UTC (' + daysAgo(Date.now() - temp2.getTime()) + ' days ago)', true)
      .setColor(m.displayHexColor)
      .addField('Member Roles [' + (m.roles.cache.size - 1) + ']', rolestring)
      .addField('Special Permissions', permstring)
      .addField('Banner', '\u2800')
      .setThumbnail(m.user.displayAvatarURL({ dynamic: true }))
      .setFooter('ID: ' + m.id)
      .setTimestamp();
    if (URL) {
      embed.setImage(URL)
    }
    return message.reply({ embeds: [embed] })
  }
}