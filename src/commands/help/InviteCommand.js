const Discord = require('discord.js');
const { Permissions } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');
const odm = require('../../odm.js');

module.exports = class InviteCommand extends BaseCommand {
  constructor() {
    super('invite', 'help', ['inv'], 2, 'Provides a link to invite the bot to your own server.', 'invite');
  }

  async run(client, message, args) {
    const inviteLink = client.generateInvite({
      scopes: ['applications.commands', 'bot'],
      permissions: [Permissions.FLAGS.ADMINISTRATOR, Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.CHANGE_NICKNAME, Permissions.FLAGS.MANAGE_NICKNAMES, Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS, Permissions.FLAGS.MANAGE_WEBHOOKS, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.USE_PUBLIC_THREADS, Permissions.FLAGS.USE_PRIVATE_THREADS, Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_THREADS, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.MENTION_EVERYONE, Permissions.FLAGS.USE_EXTERNAL_EMOJIS, Permissions.FLAGS.ADD_REACTIONS],
    })
    const supportInviteLink = 'https://discord.gg/qDPSXHwRdQ'

    const row = new Discord.MessageActionRow()
      .addComponents([
        new Discord.MessageButton()
          .setLabel('Invite')
          .setStyle('LINK')
          .setURL(inviteLink),
        new Discord.MessageButton()
          .setLabel('Support')
          .setStyle('LINK')
          .setURL(supportInviteLink),
      ])
    const embed = new Discord.MessageEmbed()
      .setAuthor('Annie Leonhart', client.user.displayAvatarURL())
      .setColor(odm.color)
      .addField('Invite the Bot', '[Add the Bot](' + inviteLink + ')', true)
      .addField('Support Server', '[Get help](' + supportInviteLink + ')', true)
      .setFooter('Bot by xkwg.youtuber#3685 | Running since March 2021');
    return message.reply({ embeds: [embed], components: [row] });
  }
}