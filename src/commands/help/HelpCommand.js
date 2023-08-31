const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'help', [], null, 'Gives generic or command-specific help with the bot depending on command usage.', 'help [command]');
  }

  async run(client, message, args) {
    const adminCommands = ['settings', 'stomp']
    const animeCommands = ['animesearch', 'mudaeremind']
    const funCommands = ['bon', 'editsnipe', 'snipe', 'valmap']
    const helpCommands = ['about', 'help', 'invite', 'supportserver']
    const moderationCommands = ['lockdown', 'purge', 'slowmode', 'unlockdown']
    const utilityCommands =['afk', 'avatar', 'choose', 'firstmessage', 'kweenify', 'minecraftstatus', 'ping', 'remind', 'rescue', 'serverinfo', 'spoiler', 'steal', 'userinfo']

    function cmdEmbedGen(cmdName) {
      let hello = []
      const command = client.commands.get(cmdName)
      if (!command) {
        return { content: 'Please enter a valid command! `' + cmdName + '` is not an existing command.' }
      }
      if (command.aliases.length === 0) {
        hello = 'none'
      }
      else {
        hello = '[' + command.aliases.join(', ') + ']'
      }
      let cmdEmbed = new Discord.MessageEmbed()
          .setTitle(command.name.slice(0, 1).toUpperCase() + command.name.slice(1, command.name.length) + ' Command Help')
          .setDescription('```Aliases: ' + hello + '```')
          .addField('Category:', command.category.slice(0, 1).toUpperCase() + command.category.slice(1, command.category.length))
          .addField('Description:', command.description)
          .addField('Cooldown:', (command.cooldown || 3) + ' second(s)')
          .setColor('#0084db')
          .setFooter(client.user.tag, client.user.displayAvatarURL())
          .setTimestamp();
      //#region Command specific
      if (command === client.commands.get('vm')) {//valmap command
        cmdEmbed.addField('Usage:', '```' + client.prefix + command.syntax  + '```\n To remove certain maps from the selection pool: \n```' + client.prefix + 'valmap n/not <map1> [map2]...[mapn]```\n To specify the maps to be selected from: \n ```' + client.prefix + 'valmap <map1> <map2> [map3]...[mapn]```')
      }
      else if (command === client.commands.get('remind')) {//remind command
        cmdEmbed.addField('Usage:', '```' + client.prefix + command.syntax  + '```\n To get a list of all your reminders: \n```' + client.prefix + 'remind list```\n To delete a specific reminder: \n ```' + client.prefix + 'remind remove/-/delete <reminderID>```\n To edit a reminder you previously set: \n ```' + client.prefix + 'remind edit <reminderID> <new reason>``` \n To clear all your reminders: \n ```' + client.prefix + 'remind clear```\n')
      }
      else if (command === client.commands.get('purge')) {
        cmdEmbed.addField('Usage:', '```' + client.prefix + command.syntax + '```\n To purge all messages after a specific message: \n```' + client.prefix + 'purge after <id>```\n To purge your own messages (does not require Manage Messages permission): \n ```' + client.prefix + 'purge s/self <number>```\n To purge bot messages: \n ```' + client.prefix + 'purge bot/bots <number>```\n To purge messages from a specific user: \n```' + client.prefix + 'purge user <@user/ID> <number>```')
      }
      else if (command === client.commands.get('settings')) {
        cmdEmbed.addField('Usage: ', '```' + client.prefix + command.syntax + '```\nTo change your prefix: \n ```' + client.prefix + 'settings prefix <prefix>```\nTo reset your server settings: \n```' + client.prefix + 'settings reset```\nTo list configuration for a certain command: \n```' + client.prefix + 'settings list <commandname>```\n To enable or disable a command for a channel or role; mentioning no role/channel will disable/enable the command for all channels or all roles. This command supports entering multiple channels or roles in one command. \n ```' + client.prefix + 'settings restrict/unrestrict <commandname> [#channel/ID]\n' + client.prefix + 'settings disable/enable <commandname> [@role/ID]```\n To remove role, channel, or all settings for a command: \n ```' + client.prefix + 'settings remove <commandname> [roles/channels]```')
      }
      else if (command === client.commands.get('mudaeremind')) {
        cmdEmbed.addField('About', 'This feature DMs you a reminder message every hour when your roulette rolls on the Mudae bot have reset. Hourly reminds you every hour unconditionally, while smart only sends a reminder if you completed your rolls the previous hour. Reminders are server specific.\n **Note:** You must roll once after you run out of rolls and trigger the `roulette is limited to \_\_ uses per hour` message in order for smart reminders to work.')
        cmdEmbed.addField('Usage', 'To enable Mudae roll reset reminders:```' + client.prefix + 'mudaeremind enable <hourly | smart>```\nTo disable Mudae reminders: \n ```' + client.prefix + 'mudaeremind disable```')
      }
      else {
        cmdEmbed.addField('Usage:', '```' + client.prefix + command.syntax  + '```')
      }
      //#endregion
      return { embeds: [cmdEmbed] }
    }


    if (!args[0]) {//base help command
      const baseHelp = new Discord.MessageEmbed()
          .setTitle('Annie Leonhart Help')
          .setThumbnail(client.user.displayAvatarURL)
          .setDescription('**My prefix is** `' + client.prefix + '`**.**\n\n**List of Commands**\nIf you need help with the bot, join the Annie Leonhart support server [here](https://discord.gg/qDPSXHwRdQ) to stay up to date with the latest bot updates!')
          .addField('Admin', '```' + adminCommands.join(', ') + '```')
          .addField('Anime', '```' + animeCommands.join(', ') + '```')
          .addField('Fun', '```' + funCommands.join(', ') + '```')
          .addField('Help', '```' + helpCommands.join(', ') + '```')
          .addField('Moderation', '```' + moderationCommands.join(', ') + '```')
          .addField('Utility', '```' + utilityCommands.join(', ') + '```')
          .setFooter('Run ' + client.prefix + 'help <command> to see command-specific details.')
          .setColor('#3498DB')
          .setTimestamp();
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setLabel('Support')
            .setStyle('LINK')
            .setURL('https://discord.gg/qDPSXHwRdQ')
          );
      return message.reply({ embeds: [baseHelp], allowedMentions: { repliedUser: false }, components: [row] })
    }
    if (args[0] === 'help' && args[1] === 'help') {
      return message.reply({ content: 'https://tenor.com/view/stop-it-get-some-help-gif-15058124' })
    }
    else {
      return message.reply(cmdEmbedGen(args[0]))
    }

    

  }
}
