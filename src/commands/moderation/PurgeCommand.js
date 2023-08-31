const BaseCommand = require('../../utils/structures/BaseCommand');
const { Permissions } = require('discord.js')

module.exports = class PurgeCommand extends BaseCommand {
  constructor() {
    super('purge', 'moderation', ['bulkdelete', 'pu'], 5, 'Deletes all messages meeting the specified parameters in the last x messages.', 'purge <number>');
  }

  async run(client, message, args) {
    let purgetype = 'default'
    let amountToDelete = null
    let target = ''
    let manager = []
    //Permission Checking:
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) && args[0] !== 'self' && args[0] !== 's') {
      return message.reply({ content: 'You do not have the `MANAGE_MESSAGES` permission required to use this command.' })
    }
    else if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message.reply({ content: 'I do not have the `MANAGE_MESSAGES` permission required to use this command.' })
    }

    let channel = message.channel
    if (!args[0] && !args[1]) {//Arguments defined
      return message.reply({ content: 'Please specify a number of messages to delete.', allowedMentions: { repliedUser: false } })
    }
    else if (Number(args[0]) && Number(args[0] <= 100)) {//Regular Purge
      amountToDelete = Number(args[0])
    }
    else {//Special Purge
      amountToDelete = Number(args[1])
      if (args[0] === 'self' || args[0] === 's') {//Self Purge
        purgetype = 'user'
        target = message.author
      }
      else if (args[0] === 'bot' || args[0] === 'bots') {//Bot Purge
        purgetype = 'bot'
      }
      else if (args[0] === 'user') {//User Purge
        purgetype = 'user'
        target = message.mentions.users.first()
        if (!target) {
          target = await message.guild.members.fetch(args[1])
          target = target.user
        }
        amountToDelete = Number(args[2])
      }
      else if (args[0] === 'after') {//Purge After
        try {
          manager = await channel.messages.fetch({ after: args[1] })
          return channel.bulkDelete(manager)
        }
        catch (error) {
          console.error(error)
          message.reply({ content: 'Please enter a valid message ID.', allowedMentions: { repliedUser: false }})        
        }
      }
      else {
        return message.reply({ content: 'I did not recognize your purge parameters. Please run `' + client.prefix + 'help purge` for information.', allowedMentions: { repliedUser: false }})
      }
    }
    await message.delete()
      .catch(error => console.error(error))
    if (!target && purgetype === 'user') {
      return message.reply({ content: 'Please mention a valid user or ID.', allowedMentions: { repliedUser: false }})
    }
    manager = await channel.messages.fetch({ limit: amountToDelete })
    if (purgetype === 'bot') {
      manager = manager.filter(m => m.author.bot === true)
    }
    else if (purgetype === 'user') {
      manager = manager.filter(m => m.author.id === target.id)
    }
    let k = await channel.bulkDelete(manager)
    let x = []
    let y = []
    let counter = 0
    let z = ''
    k.each(m => {
      if (x.includes(m.author.id)) {
        let temp = x.indexOf(m.author.id)
        y[temp] = y[temp] + 1
      }
      else {
        x.push(m.author.id)
        y.push(1)
      }
      counter = counter + 1
    })
    z = counter.toString() + ' messages removed.\n\n'
    for (let i = 0; i < x.length; i++) {
      let temp = await message.guild.members.fetch(x[i])
      temp = temp.user
      z = z + '**'+ temp.tag + '**: ' + y[i].toString() + '\n'
    }
    try {
      const m = await message.channel.send(z)
      setTimeout(async () => {
        await m.delete();
      }, 3000);
    }
    catch (error) {
      console.error(error);
    }

  }
}