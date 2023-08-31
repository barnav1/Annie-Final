const BaseEvent = require('../../utils/structures/BaseEvent');
const util = require('minecraft-server-util')
const Discord = require('discord.js');
const mongoose = require('mongoose');
const Setting = require('../../database/models/settingsSchema');
const Reminder = require('../../database/models/reminderSchema');
const Mudae = require('../../database/models/mudaeSchema');
const odm = require('../../odm.js');
require('dotenv').config();

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run (client) {
    console.log(client.user.tag + ' has logged in.');
    client.user.setPresence({
      activities: [{
        name: '@Annie help',
        type: 'WATCHING',
      }],
      status: 'online',
    });
    await odm.memberCount(client);
    await client.channels.cache.get('892618215656665098').send(client.user.tag + ' has logged in. Member count: ' + client.memberCount);
    //#region Swag Role Color Cycle
    function swagRole(num) {
      function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      }
      let number = 8;
      let hue = Math.round(360 / number) * num;
      let sat = 85;
      let light = 60;
      return hslToHex(hue, sat, light);
    }
    const role = await client.guilds.cache.get('757346743598710866').roles.fetch('873935089548013629');
    setInterval(async () => {
      await role.setColor(swagRole(client.swagrole));
      client.swagrole += 1;
      if (client.swagrole === 8) {
        client.swagrole = 0;
      }
    }, 600000);
      //#endregion

    //#region Interval Status Check
    setInterval(() => {
      client.guilds.cache.get('824159759041167390').channels.cache.get('849990723439820830').send('Interval Pong! :ping_pong:');
    }, 600000)
    //#endregion

    //#region SMP Zero and Refresh Timer
    const mcm = await client.guilds.cache.get('757346743598710866').channels.cache.get('939932333706969098').messages.fetch('942053730218541096');
    async function szmcRefresh() {
      let serverIP = ['92.6.23.70', 55555]
      try {
        const mcinfo = await util.status(serverIP[0], { port: serverIP[1] })
        let playerList = []
        if (mcinfo.samplePlayers && mcinfo.samplePlayers.length !== 0) {
          mcinfo.samplePlayers.forEach(({ id, name }) => playerList.push(name))
          playerList = playerList.join(' \n')
        } 
        else {
          playerList = '\n\n\n'
        }
        const serverinfo = new Discord.MessageEmbed()
          .setColor('#11D646')
          .setTitle('Subject Zero Server Status')
          .setThumbnail(mcm.guild.iconURL({ dynamic: true }))
          .addField('Server IP and Port', '```' + mcinfo.host + ':' + mcinfo.port + '```')
          .addField('Server Version', '```' + mcinfo.version + '```')
          .addField('Players Online: ```' + mcinfo.onlinePlayers + '```', '```' + playerList + '```')
          .addField('Max Players', '```' + mcinfo.maxPlayers + '```')
          .setFooter('Last updated:')
          .setTimestamp();
        await mcm.edit({ embeds: [serverinfo] })
      }
      catch (error) {
        console.error(error)
        const serverinfo = new Discord.MessageEmbed()
          .setColor('#E61E10')
          .setTitle('SMP Zero Server Status: Offline')
          .setThumbnail(mcm.guild.iconURL({ dynamic: true }))
          .addField('Players Online: ```0```', '```Server Offline```')
          .setFooter('Last updated:')
          .setTimestamp();
        await mcm.edit({ embeds: [serverinfo] })
      }
    }
    /*
    setInterval(async () => {
      try {
        await szmcRefresh();
      }
      catch (error) {
        console.error(error)
      }
    }, 60000)
    */
    const rtcommand = client.commands.get('rt');
    await rtcommand.run(client)
    //#endregion

    //#region Mudae Reminder System
    async function mudaeRemind() { 
      let sdb = await Setting.find({})
      sdb = sdb.filter(s => s.mrTime !== 1000)
      sdb.forEach(async server => {
        let timeout = (server.mrTime * 60000) - (Date.now() % 3600000)
        if (timeout < 0) timeout += 3600000
        setTimeout(async () => {
          let mdb = await Mudae.find({ guildID: server.guildID })
          mdb = mdb.filter(u => u.reminderType === 'hourly' || u.hasRolled)
          mdb.forEach(async u => {
            const guild = client.guilds.cache.get(server.guildID)
            const user = await client.users.fetch(u.userID)
            if (!user) return;
            let dm = user.dmChannel
            if (!dm) {
              dm = await user.createDM()
                .catch(error => console.error(error))
            }
            const embed = new Discord.MessageEmbed()
              .setTitle('Rolls Reminder!')
              .setColor(odm.color)
              .addField('Reminder Type', u.reminderType)
              .setFooter('Turn off Mudae reminders by running -mr disable.')
              .setTimestamp();
            let url;
            let temp = client.guilds.cache.get(server.guildID).channels.cache.filter(c => c.members.has(u.userID)).first()
            if (temp) {
              temp = await temp.messages.fetch({ limit: 1 })
              url = temp.first().url
              embed.setDescription("It's time to do your Mudae rolls in **" + guild.name + "**!\n[Go to server!](" + url + ")")       
            }
            else {
              embed.setDescription("It's time to do your Mudae rolls in **" + guild.name + "**!")              
            }
            try {
              await dm.send({ embeds: [embed] })
              await Mudae.updateOne({ userID: u.userID, guildID: server.guildID }, { hasRolled: false })
            }
            catch (error) {
              return
            }
          })
        }, timeout)
      })
    }
    await mudaeRemind()
      .catch(error => console.error(error))
    setInterval(async () => {
      await mudaeRemind()
        .catch(error => console.error(error))
    }, 3600001);
    //#endregion

    //#region Reminder System
    setInterval(async () => {
      let remdb = await Reminder.find({})
      remdb.forEach(async rem => {
        let remuser = await client.users.fetch(rem.userID)
        let wait = rem.timeSet + rem.duration - Date.now()
        if (wait > 2000) return;
        let dmchannel = remuser.dmchannel
        if (!dmchannel) {
          try {
            dmchannel = await remuser.createDM()
          }
          catch (error) {
            console.error(error)
          }
        }
        const reminderEmbed = new Discord.MessageEmbed()
          .setTitle('Reminder! ID: ' + rem.reminderID.toString())
          .setColor('#BDE1FF')
          .setDescription(odm.msParse(Date.now() - rem.timeSet, 2) + ' ago, you asked to be reminded of "' + rem.reason + '".')
          .addField('Original message', '[Jump!](' + rem.messageURL + ')')
        try {
          await dmchannel.send({ embeds: [reminderEmbed] })
          await Reminder.deleteOne({ reminderID: rem.reminderID })
        }
        catch (error) {
          console.error(error);
        }
      })              
    }, 25000);
    //#endregion
  
  }
}