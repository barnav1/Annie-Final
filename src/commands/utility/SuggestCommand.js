const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
module.exports = class SuggestCommand extends BaseCommand {
  constructor() {
    super('suggest', 'utility', []);
  }

  async run(client, message, args) {
    let sugg = ''
    if (message.channel.id !== '859977834181033987' && message.channel.id !== '847881397980233748' && message.channel.id !== '878679061428330537') return;
    else {
      if (message.channel.id === '859977834181033987') {//Annie
        sugg = '860366348483559444'
        const messagetoSay = args.join(' ');
        const suggestEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL())
            .setColor(message.member.roles.highest.hexColor)
            .setTitle('New Suggestion!')
            .setDescription(messagetoSay);
        const m = await client.channels.cache.get(sugg).send({ embeds: [suggestEmbed] })
        try {
          await m.react('⬆️');
          await m.react('⬇️');
        }
        catch (error) {
          console.error(error);
        }
    
      }
      else if (message.channel.id === '847881397980233748'){//TFJ
        sugg = '847502567607894017'
        const messagetoSay = args.join(' ');
        const suggestEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL())
            .setColor(message.member.roles.highest.hexColor)
            .setTitle('New Suggestion!')
            .setDescription(messagetoSay + '\n\nReact with <:hype:729121615756918894> to vote YES and <:boi:729121571150757989> to vote NO.');
        const m = await client.channels.cache.get(sugg).send({ content: '<@&847531202931720202>', embeds: [suggestEmbed] });
        try {
          await m.react('729121615756918894');
          await m.react('729121571150757989');
        }
        catch (error) {
          console.error();
        }
      }
      else {
        sugg = '878681365405638726'
        const messagetoSay = args.join(' ');
        const suggestEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.member.user.displayAvatarURL())
            .setColor('#F59843')
            .setTitle('New Suggestion!')
            .setDescription(messagetoSay + '\n\nReact with <:pog:878352214639403008> to upvote and <:ded:878352190257905745> to downvote.');
        const m = await client.channels.cache.get(sugg).send({ embeds: [suggestEmbed] });
        try {
          await m.react('878352214639403008');
          await m.react('878352190257905745');
        }
        catch (error) {
          console.error();
        }
      }
    }    
    return message.delete();
  }
}