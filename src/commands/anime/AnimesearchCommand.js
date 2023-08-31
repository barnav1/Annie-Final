const BaseCommand = require('../../utils/structures/BaseCommand');
const malScraper = require('mal-scraper');
const Discord = require('discord.js');
const odm = require('../../odm.js');

module.exports = class AnimesearchCommand extends BaseCommand {
  constructor() {
    super('animesearch', 'anime', ['asearch', 'as'], 10, 'Returns information about a specific anime.', 'animesearch <name>');
  }

  async run(client, message, args) {
    if (!args[0]) {
      const m = await message.reply({ content: 'Please specify an anime to look up.' })
      setTimeout(() => {
        m.delete();        
      }, 3000);
      return
    }
    let db;
    try {
      db = await malScraper.getInfoFromName(args.join(' '), false)
    }
    catch (error) {
      console.error(error)
    }
    
    if (!db) {
      const m = await message.reply({ content: "I couldn't find an anime called `" + args.join(' ') + '`.' })
      setTimeout(() => {
        m.delete();
      }, 5000);
    }

    if (!message.channel.nsfw && (db.rating.slice(0, 2) === 'Rx' || db.rating.slice(0, 2) === 'R+')) {
      return message.reply({ content: "This anime's data may contain content that is not safe for work. To view this anime's info, run this command in an NSFW channel.", allowedMentions: { repliedUser: true }})
    }
    
    //#region Data Processing
    const temp = [{ name: 'Japanese Name: ', value: db.japaneseTitle, inline: true },
    { name: 'Other Names: ', value: db.synonyms.join(', '), inline: true,},
    { name: 'Media Type: ', value: db.type},
    { name: 'Episodes', value: db.episodes, inline: true },
    { name: 'Status: ', value: db.status, inline: true},
    { name: 'Studios', value: db.studios.join(', ') },
    { name: 'Rating (out of 10)', value: db.score + ' (' + db.scoreStats + ') ', inline: true },
    { name: 'Genres', value: db.genres.join(', '), inline: true },
    { name: 'Rank', value: db.ranked }]
    temp.forEach(object => {
      if (object.value.length === 0) {
        temp.splice(temp.indexOf(object), 1)
      }            
    });
    //#endregion

    const embed = new Discord.MessageEmbed()
      .setTitle('Anime: ' + db.title)
      .setColor('#7283F2')
      .setThumbnail(db.picture)
      .addFields(temp)
      .setFooter('Page 1 of 2.');

    const embed2 = new Discord.MessageEmbed()
        .setTitle('Anime: ' + db.title)
        .setColor('#7283F2')
        .setThumbnail(db.picture)
        .setDescription('**Description:**\n\n' + db.synopsis.slice(0, -25), true)
        .addField('Aired: ', db.aired, true)
        .addField('MAL Page: ', db.url)
        .setFooter('Page 2 of 2.');
    
    const row = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('previousPage')
          .setLabel('Last Page')
          .setStyle('PRIMARY')
          .setEmoji('⬅️')
      )
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('nextPage')
          .setLabel('Next Page')
          .setStyle('PRIMARY')
          .setEmoji('➡️')
      );
    const embedArray = [embed, embed2]
    let m = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, components: [row] })
    const filter = interaction => interaction.customId === 'nextPage' || interaction.customId === 'previousPage'
    const collector = m.createMessageComponentCollector({ filter: filter, idle: 30000 })
    collector.on('collect', async interaction => {
      await interaction.deferUpdate();
      m = await message.channel.messages.fetch(m.id)
      let current = Number(m.embeds[0].footer.text.slice(5,6)) - 1
      if (interaction.customId === 'previousPage') {
        await m.edit({ embeds: [odm.pageNav(embedArray, embedArray[current], false)] })
      }
      else {
        await m.edit({ embeds: [odm.pageNav(embedArray, embedArray[current], true)] })
      }
    })
    collector.on('end', async () => {
      for (let i = 0; i < row.components.length; i++) {
        row.components[i] = row.components[i].setDisabled();
      }
      await m.edit({ components: [row] })
    })
  }
}