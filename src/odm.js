const fetch = require('node-fetch');
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
  timeParse: function(str) {
    const timeregex = new RegExp(/((?:-?(?:\d+)?\.?\d+) *(?:milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y))/gi)
    const match = str.match(timeregex)
    let mstime = 0
    for (let i = 0; i < match.length; i++) {
      const reg1 = new RegExp(/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?/i)
      const temp = match[i].match(reg1)
      switch (temp[2]) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          mstime += temp[1] * 31557600000
          break;
        case 'weeks':
        case 'week':
        case 'w':
          mstime += temp[1] * 604800000
          break;
        case 'days':
        case 'day':
        case 'd':
          mstime += temp[1] * 86400000
          break;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          mstime += temp[1] * 3600000
          break;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          mstime += temp[1] * 60000
          break;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          mstime += temp[1] * 1000
          break;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          mstime += temp[1]
          break;
        default:
          break;
      }
    }
    return [mstime, str.replace(timeregex, '').trim()]
  },
  msParse: function(ms, strlength) {
    //Helpers:
    if (!strlength) {
      strlength = 2
    }
    const s = 1000;
    const m = s * 60
    const h = m * 60
    const d = h * 24
    const w = d * 7
    const mo = w * 4.34821
    const y = d * 365.25
    
    const helper = [y, mo, w, d, h, m, s]
    const helper2 = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']
    const str = []
    const num = [ms, ms % y, ms % mo, ms % w, ms % d, ms % h, ms % m]
    
    for (let i = 0; i < num.length; i++) {
      num[i] = Math.floor(num[i] / helper[i])
      if (str.length === strlength) break;
      if (num[i] !== 0) {
        str.push(num[i] + ' ' + helper2[i] + (num[i] > 1 ? 's' : ''))
      }        
    }
    if (str.length > 1) {
      return str.slice(0, -1).join(', ') + ' and ' + str.slice(-1).join(' ')
    }
    else {
      return str.join(', ')
    }
  },
  imageLogEmbed: async function(message, attachment, logsChannel) {
    const video = ['avi', 'mp4', 'mov']
    if (video.includes(attachment.proxyURL.slice(-3))) return;
    const response = await fetch(attachment.proxyURL);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const att = new Discord.MessageAttachment(buffer, attachment.name)
    const imgLogEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription('**Image sent in <#' + message.channel.id + '>** by <@' + message.author.id + '>')
      .addField('Name', '[' + attachment.name + '](' + message.url + ')')
      .setImage('attachment://' + attachment.name)
      .setColor('#7283F2')
      .setTimestamp();
    return await logsChannel.send({ embeds: [imgLogEmbed], files: [att]})
  },
  pageNav: function(array, current, next) {
    let index = []
    if (next) {
      index = array.indexOf(current) + 1
      if (index + 1 > array.length) {
        index = 0
      }
      return array[index]
    }
    else {
      index = array.indexOf(current) - 1
      if (index < 0) {
        index = array.length - 1
      }
      return array[index]
    }
  },
  memberCount: async function(client) {
    let memberCount = 0
    let processed = 0
    const total = client.guilds.cache.size
    client.guilds.cache.each(async g => {
      let guild = await g.fetch();
      memberCount = memberCount + g.approximateMemberCount;
      processed++;
      if (processed === total) {
        client.memberCount = memberCount
      }
    })
  },
  color: '#7283F2',
}