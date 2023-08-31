const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const odm = require('../../odm.js');
const mongoose = require('mongoose');
const Reminder = require('../../database/models/reminderSchema');
const Constant = require('../../database/models/constantSchema');

module.exports = class RemindCommand extends BaseCommand {
  constructor() {
    super('remind', 'utility', ['rm'], 3, 'Gets the bot to send you a DM reminder regarding a certain event after a specified duration.', 'remind <time> [reason]');
  }

  async run(client, message, args) {
    if (!args[0]) {
      return message.reply({ content: 'Please enter a valid time e.g. 5 minutes, 2m, 3h50m, 3 hours 2 minutes.' })
    }
    if (args[0] === 'list') {
      let reminderdb = []
      try {
        reminderdb = await Reminder.find({ userID: message.author.id })
        if (reminderdb.length === 0) {
          return message.reply({ content: 'You currently have no reminders.' })
        }
      }
      catch (error) {
        console.error(error);
      }

      let finalmsg = ''
      reminderdb.sort((r1, r2) => (r1.timeSet + r1.duration) - (r2.timeSet + r2.duration))
      reminderdb.forEach(async reminder => {
        let temp = new Date(reminder.timeSet + reminder.duration)
        let date = temp.toLocaleDateString({ timeZone: 'UTC' }).replace(/\//gi, "-") + ' ' + temp.toLocaleTimeString('en-GB', { timeZone: 'UTC'})
        finalmsg = finalmsg + 'ID: ' + reminder.reminderID.toString() + ' | ' + date + ' UTC - ' + reminder.reason + '\n'
      })
      finalmsg = '```' + finalmsg + '```'
      
      return message.reply({ content: finalmsg, allowedMentions: { repliedUser: false }})
    }
    if (['remove', '-', 'delete'].includes(args[0])) {
      if (!Number(args[1])) return;
      const toRemove = await Reminder.findOne({ userID: message.author.id, reminderID: Number(args[1]) })
      if (toRemove) {
        await Reminder.findOneAndDelete({ userID: message.author.id, reminderID: Number(args[1]) })
        return message.reply({ content: 'Reminder cleared.' })
      }
      return message.reply({ content: "I couldn't find any reminders with that ID." })
    }
    if (args[0] === 'clear') {
      const confirmEmbed = new Discord.MessageEmbed()
        .setAuthor(' ', client.user.displayAvatarURL())
        .setDescription('Are you sure you want to clear all your reminders?')
        .setTimestamp();
      
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('confirmReminderClear')
            .setLabel('CONFIRM')
            .setStyle('SUCCESS')
        )
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('cancelReminderClear')
            .setLabel('CANCEL')
            .setStyle('DANGER')
        );
      const m = await message.reply({ embeds: [confirmEmbed], allowedMentions: { repliedUser: true }, components: [row] })
      const filter = interaction => interaction.customId === 'confirmReminderClear' || interaction.customId === 'cancelReminderClear'
      const collector = m.createMessageComponentCollector({ filter: filter, time: 10000 })
      collector.on('collect', async interaction => {
        await interaction.deferUpdate();
        if (interaction.user.id !== message.author.id) {
          return interaction.followUp({ content: 'This is not for you.', ephemeral: true })
        }
        if (interaction.customId === 'confirmReminderClear') {
          try {
            await Reminder.deleteMany({ userID: message.author.id })
            collector.stop()
            return interaction.followUp({ content: 'All reminders cleared.', ephemeral: true })
          }
          catch (error) {
            console.error(error)
            collector.stop()
            return interaction.followUp({ content: 'I was unable to clear your reminders. Please try again.', ephemeral: true })
          }
        }
        else {
          collector.stop()
          return interaction.followUp({ content: 'Reminder clear cancelled.', ephemeral: true })   
        }
      })
      collector.on('end', async () => {
        for (let i = 0; i < row.components.length; i++) {
          row.components[i] = row.components[i].setDisabled();
        }
        await m.edit({ components: [row] })
      })
      return
    }
    if (args[0] === 'edit') {
      let r = await Reminder.findOne({ userID: message.author.id, reminderID: Number(args[1]) })
      if (!r) {
        return message.reply({ content: "I couldn't find a reminder with that ID." })
      }
      r.reason = args.slice(1).join(' ')
      try {
        await r.save()
        await message.reply({ content: 'Reminder edited!', allowedMentions: { repliedUser: false }})
      }
      catch (error) {
        console.error(error);
        return message.reply({ content: 'I ran into an issue saving your changes. Please try again.' })
      }
    }
    else {
      const wait = odm.timeParse(args.join(' '))[0]
      const arg = odm.timeParse(args.join(' '))[1]
      if (!Number(wait)) {
        return message.reply({ content: 'Please enter a valid time e.g. 5 minutes, 2m, 3h50m, 3 hours 2 minutes.' })
      }
      const currentID = await Constant.find({})
      const current = currentID[0].reminderCounter + 1
      const reason = arg || "something"
      const reminder = await new Reminder({
        _id: mongoose.Types.ObjectId(),
        reminderID: current,
        userID: message.author.id,
        messageURL: message.url,
        timeSet: Date.now(),
        duration: wait,
        reason: reason,
      })
      try {
        await reminder.save()
        await Constant.findOneAndUpdate({}, { $inc: { reminderCounter: 1 } })
        let temp = odm.msParse(wait, 2)
        const options = {
          content: 'Okay, I will remind you about "' + reason + '" in ' + temp + '.',
          allowedMentions: { 
            repliedUser: true, 
            parse: message.member.permissions.has(Discord.Permissions.FLAGS.MENTION_EVERYONE) ? ['users', 'roles'] : ['users']  
          }
        }
        message.reply(options)
      }
      catch (error) {
        return message.reply({ content: 'I ran into an issue saving the reminder. Please try again.' })
      }
      let dmchannel = message.author.dmChannel
      if (!dmchannel) {
        dmchannel = await message.author.createDM()
          .catch((error) => {
            console.error(error);
            return message.reply({ content: 'I am unable to DM you. Please check your DM privacy settings.' })
          })
      }
    }
  }
}