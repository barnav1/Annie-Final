const BaseCommand = require('../../utils/structures/BaseCommand');
const Setting = require('../../database/models/settingsSchema');
const mongoose = require('mongoose')
const Discord = require('discord.js')
const odm = require('../../odm.js');

module.exports = class SettingsCommand extends BaseCommand {
  constructor() {
    super('settings', 'admin', [], 6, 'Change the configuration of the bot.', 'settings');
  }

  async run(client, message, args) {
    if (!message.member.permissions.has("MANAGE_GUILD")) {
      return message.reply({ content: 'You do not have the `MANAGE_SERVER` permission required to run this command.' })
    }
    let db = await Setting.findOne({ guildID: message.guild.id })
    const yes = ['true', 'enable', 'enabled', 'yes', 'y']
    const no = ['false', 'disable', 'disabled', 'no', 'n']
    if (!args[0]) {
      const mrStatus = db.mrTime === 1000 ? 'false' : 'true'
      const embed = new Discord.MessageEmbed()
        .setTitle('Settings for ' + message.guild.name)
        .setColor(odm.color)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addFields(
          { name: 'Prefix', value: '`' + client.prefix + '`\n\n Run `' + client.prefix + 'settings prefix <newprefix>` to change your prefix.' },
          { name: 'Command Settings', value: 'Customising where and by whom commands can be used.\n\n Run `' + client.prefix + 'settings list <commandname>` to see settings for a particular command. Run `' + client.prefix + 'help settings` for info on how to modify command settings.' },
          { name: '\u200B', value: '\u200B' },
          { name: 'Other Settings', value: 'Run `' + client.prefix + 'settings <settingName> <true | false>` to change the value of a setting.\n\n`mudaeRemind`: ' + mrStatus + '\n\n Need help with changing your settings, or understanding how it works? Join [Annie Leonhart Support](https://discord.gg/qDPSXHwRdQ)!'},
        )
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }})
    }
    if (args[0] === 'list') {
      if (!args[1]) {
        return message.reply({ content: 'Please enter a command to list settings for.' })
      }
      const command = client.commands.get(args[1])
      if (!command) {
        return message.reply({ content: '`' + args[1] + '` is not a valid command. Please try again.' })
      }
      let settings = [db.entrylist.get(command.name), db.restrictlist.get(command.name), db.renablelist.get(command.name), db.rdisablelist.get(command.name)]
      for (let i = 0; i < settings.length; i++) {
        if (!settings[i]) {
          settings[i] = 'none'
        }
        else {
          let string = []
          if (settings[i][0] === 'all') {
            if (i < 2) {
              settings[i] = 'In all channels'
            }
            else {
              settings[i] = 'For all roles'
            }
          }
          else if (i < 2) {
            settings[i].forEach(c => {
              string.push('<#' + c + '>')                            
            })
            settings[i] = string.join(', ')
          }
          else {
            settings[i].forEach(r => {
              string.push('<@&' + r + '>')
            })
            settings[i] = string.join(', ')
          }
        }
      }
      const embed = new Discord.MessageEmbed()
        .setTitle('Command Settings for ' + command.name + ' in ' + message.guild.name)
        .setColor(odm.color)
        .setThumbnail(message.guild.iconURL( { dynamic: true }))
        .addFields(
          { name: '__Channels__', value: '\u200B'},
          { name: 'Enabled', value: settings[0], inline: true},
          { name: 'Disabled', value: settings[1], inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: '__Roles__', value: '\u200B'},
          { name: 'Enabled', value: settings[2], inline: true},
          { name: 'Disabled', value: settings[3], inline: true },
        )
        .setFooter('Run ' + client.prefix + 'help settings for help with disabling commands.')
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }})
    }
    if (args[0] === 'reset') {
      const confirmEmbed = new Discord.MessageEmbed()
        .setAuthor(' ', client.user.displayAvatarURL())
        .setDescription('Are you sure you want to completely reset your server settings? This action cannot be undone.')
        .setTimestamp();
      
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('confirmSettingsClear')
            .setLabel('CONFIRM')
            .setStyle('SUCCESS')
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('cancelSettingsClear')
            .setLabel('CANCEL')
            .setStyle('DANGER')
        );
      const m = await message.reply({ embeds: [confirmEmbed], allowedMentions: { repliedUser: true }, components: [row] })
      const filter = interaction => interaction.customId === 'confirmSettingsClear' || interaction.customId === 'cancelSettingsClear'
      const collector = m.createMessageComponentCollector({ filter: filter, time: 10000 })
      collector.on('collect', async interaction => {
        await interaction.deferUpdate();
        if (interaction.user.id !== message.author.id) {
          return interaction.followUp({ content: 'This is not for you.', ephemeral: true })
        }
        if (interaction.customId === 'confirmSettingsClear') {
          try {
            await Setting.findOneAndDelete({ guildID: message.guild.id })
            collector.stop()
            return interaction.followUp({ content: 'Server settings reset.', ephemeral: true })
          }
          catch (error) {
            console.error(error)
            collector.stop()
            return interaction.followUp({ content: 'I ran into an error resetting server settings. Please try again.', ephemeral: true })
          }
        }
        else {
          collector.stop()
          return interaction.followUp({ content: 'Server settings reset cancelled.', ephemeral: true })          
        }
      })
      collector.on('end', async () => {
        for (let i = 0; i < row.components.length; i++) {
          row.components[i] = row.components[i].setDisabled();
        }
        await m.edit({ components: [row] })
      })
    }
    if (args[0] === 'remove') {
      const command = client.commands.get(args[1])
      const settings = [db.entrylist, db.restrictlist, db.renablelist, db.rdisablelist]
      if (!command) {
        return message.reply({ content: '`' + args[1] + '` is not a valid command. Please try again.' })
      }
      if (!args[2]) {
        settings.forEach(db => {
          if (db.get(command.name)) {
            db.delete(command.name)
          }
        })
      }
      else if (args[2] === 'channels') {
        for (let i = 0; i < 2; i++) {
          if (settings[i].get(command.name)) {
            settings[i].delete(command.name)
          }
        }
      }
      else if (args[2] === 'roles') {
        for (let i = 2; i < 4; i++) {
          if (settings[i].get(command.name)) {
            settings[i].delete(command.name)
          }
        }
      }
      else {
        return message.reply({ content: 'You did not enter a valid setting to reset for this command. Please check `' + client.prefix + 'help settings` for more details.' })
      }
      try {
        await db.save()
        await message.reply({ content: 'Removed ' + (args[2] || 'all') + ' settings for the `' + command.name + '` command.' })
      }
      catch (error) {
        console.error(error)
        message.reply({ content: 'I ran into an issue saving your settings. Please try again.' })
      }
      return
    }
    if (args[0] === 'restrict') {
      const command = client.commands.get(args[1])
      let channels = []
      if (!command) {
        return message.reply({ content: '`' + args[1] + '` is not a valid command. Please try again.' })
      }
      if (!db.restrictlist.has(command.name)) {
        db.restrictlist.set(command.name, [])
      }
      if (!args[2]) {
        db.restrictlist.get(command.name)[0] = 'all'
        channels = 'all'
      }
      else {
        for (let i = 1; i < args.length; i++) {
          let c = []
          if (args[i].startsWith('<#')) {
            c = await message.guild.channels.fetch(args[i].slice(2, -1))
          }
          else {
            c = await message.guild.channels.fetch(args[i])
          }
          if (c) {
            db.restrictlist.get(command.name).push(c.id)
            channels.push(c.name)
          }
        }
        if (channels.length === 0) return;
        channels = 'the `#' + channels.join('`, `#') + '`'
      }
      try {
        await db.save()
        await message.reply({ content: 'Disabled the `' + command.name + '` command in ' + channels + ' channel(s).' })
      }
      catch (error) {
        console.error(error)
        message.reply({ content: 'There was an error saving your settings. Please try again later.' })
      }
      return
    }
    if (args[0] === 'unrestrict') {
      const command = client.commands.get(args[1])
      let channels = []
      if (!command) {
        return message.reply({ content: '`' + args[1] + '` is not a valid command. Please try again.' })
      }
      if (!db.entrylist.has(command.name)) {
        db.entrylist.set(command.name, [])
      }
      if (!args[2]) {
        db.entrylist.get(command.name)[0] = 'all'
        channels = 'all'
      }
      else {
        for (let i = 1; i < args.length; i++) {
          let c = []
          if (args[i].startsWith('<#')) {
            c = await message.guild.channels.fetch(args[i].slice(2, -1))
          }
          else {
            c = await message.guild.channels.fetch(args[i])
          }
          if (c) {
            db.entrylist.get(command.name).push(c.id)
            channels.push(c.name)
          }
        }
        if (channels.length === 0) return;
        channels = 'the `#' + channels.join('`, `#') + '`'
      }
      try {
        await db.save()
        await message.reply({ content: 'Enabled the `' + command.name + '` command in ' + channels + ' channel(s).' })
      }
      catch (error) {
        console.error(error)
        message.reply({ content: 'There was an error saving your settings. Please try again later.' })
      }
      return
    }
    if (args[0] === 'disable') {
      const command = client.commands.get(args[1])
      let roles = []
      if (!command) {
        return message.reply({ content: '`' + args[1] + '` is not a valid command. Please try again.' })
      }
      if (!db.rdisablelist.has(command.name)) {
        db.rdisablelist.set(command.name, [])
      }
      if (!args[2]) {
        db.rdisablelist.get(command.name)[0] = 'all'
        roles = 'all'
      }
      else {
        for (let i = 1; i < args.length; i++) {
          let r = []
          if (args[i].startsWith('<@&')) {
            r = await message.guild.roles.fetch(args[i].slice(3, -1))
          }
          else {
            r = await message.guild.roles.fetch(args[i])
          }
          if (r) {
            db.rdisablelist.get(command.name).push(r.id)
            roles.push(r.name)
          }
        }
        if (roles.length === 0) return;
        roles = 'the **' + roles.join('**, **') + '**'
      }
      try {
        await db.save()
        await message.reply({ content: 'Disabled the `' + command.name + '` command for ' + roles + ' role(s).' })
      }
      catch (error) {
        console.error(error)
        message.reply({ content: 'There was an error saving your settings. Please try again later.' })
      }
      return
    }
    if (args[0] === 'enable') {
      const command = client.commands.get(args[1])
      let roles = []
      if (!command) {
        return message.reply({ content: '`' + args[1] + '` is not a valid command. Please try again.' })
      }
      if (!db.renablelist.has(command.name)) {
        db.renablelist.set(command.name, [])
      }
      if (!args[2]) {
        db.renablelist.get(command.name)[0] = 'all'
        roles = 'all'
      }
      else {
        for (let i = 1; i < args.length; i++) {
          let r = []
          if (args[i].startsWith('<@&')) {
            r = await message.guild.roles.fetch(args[i].slice(3, -1))
          }
          else {
            r = await message.guild.roles.fetch(args[i])
          }
          if (r) {
            db.renablelist.get(command.name).push(r.id)
            roles.push(r.name)
          }
        }
        if (roles.length === 0) return;
        roles = 'the **' + roles.join('**, **') + '**'
      }
      try {
        await db.save()
        await message.reply({ content: 'Enabled the `' + command.name + '` command for ' + roles + ' role(s).' })
      }
      catch (error) {
        console.error(error)
        message.reply({ content: 'There was an error saving your settings. Please try again later.' })
      }
      return
    }
    if (args[0] === 'mudaeRemind') {
      let mudae;
      try {
        mudae = await message.guild.members.fetch('432610292342587392')
      }
      catch (error) {
        console.error(error);
      }
      if (!mudae) {
        return message.reply({ content: 'This server does not have the Mudae bot. Invite it first before enabling Mudae reminders.' })
      }
      if (yes.includes(args[1])) {
        let coll = false
        const filter = (message) => message.author.id === '432610292342587392'
        const collector = new Discord.MessageCollector(message.channel, filter, { time: 15000 })
        await message.reply({ content: 'Please run the Mudae settings command (usually `$settings`).' })
        collector.on('collect', async m => {
          const regex = new RegExp(/x{2}:\*\*([0-9]{2})\*\*/i)
          const reset = parseInt(m.content.match(regex)[1])
          coll = true
          try {
            await Setting.updateOne({ guildID: message.guild.id }, { mrTime: reset })
            collector.stop()
          }
          catch (error) {
            console.error(error)
            return message.reply({ content: 'I ran into an issue saving that configuration. PLease try again.' })
          }
          let remindTime = (reset * 60000) - (Date.now() % 3600000)
          if (remindTime < 0) remindTime += 3600000
          const scanTime = 3600000 - ((Date.now() - client.readyTimestamp) % 3600000)
          if (remindTime - scanTime < 0) remindTime += 3600000
          return m.reply({ content: "Mudae reminders are now enabled on your server. Based on database handling and your server's rolls reset time, reminders will start being sent after " + odm.msParse(remindTime, 2) + "." })
        })
        collector.on('end', collected => {
          if (!coll) return message.reply({ content: 'I did not see any Mudae settings commands run. Please try again.' })
        })

      }
      if (no.includes(args[1])) {
        try {
          await Setting.updateOne({ guildID: message.guild.id }, { mrTime: 1000 })
          return message.reply({ content: 'Mudae reminders are now disabled in this server.' })
        }
        catch (error) {
          console.error(error)
          message.reply({ content: 'I ran into an issue saving your settings. Please try again.' })
        }
      }
    }
    if (args[0] === 'prefix') {
      if (!args[1]) {
        return message.reply({ content: 'Please provide a new prefix. '})
      }
      const newPrefix = message.content.slice(client.prefix.length).split(' ').slice(2).join(' ')
      if (newPrefix.trim().length === 0) {
        return message.reply({ content: 'Please enter a valid prefix.', allowedMentions: { repliedUser: false }});
      }
      const confirmationEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setDescription('Are you sure you want to change your prefix to `' + newPrefix + '`? Running commands would look like this: `' + newPrefix + 'ping`\nReact with :white_check_mark: to confirm.')
        .setColor(odm.color);
      let m;
      try {
        m = await message.reply({ embeds: [confirmationEmbed], allowedMentions: { repliedUser: true }});
        await m.react('✅')
        await m.react('❌')
      }
      catch (error) {
        console.error(error)
        return message.reply({ content: 'I ran into an error. Please try again.' })
      }
      const filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id
      m.awaitReactions({ filter, max: 1, idle: 20000 })
        .then(async (collected) => {
          if (collected.size != 1) return;
          switch (collected.first().emoji.name) {
            case '✅':
              try {
                await Setting.updateOne({ guildID: message.guild.id }, { prefix: newPrefix })
              }
              catch (error) {
                return message.reply({ content: 'I ran into an issue changing your prefix, please try again.', allowedMentions: { repliedUser: true }})
              }
              return message.reply({ content: 'Prefix changed to `' + newPrefix + '`. If you forget your prefix, simply ping the bot.', allowedMentions: { repliedUser: true }})
              break;
            case '❌':
              return message.reply({ content: 'Prefix change cancelled.', allowedMentions: { repliedUser: true }});
            default:
              break;
          }
        })
    }
  }
}