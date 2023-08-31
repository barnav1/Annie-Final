const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');

module.exports = class ValmapCommand extends BaseCommand {
  constructor() {
    super('valmap', 'fun', ['vm'], 10, 'Chooses a random map from the game VALORANT.', 'valmap');
  }

  async run(client, message, args) {
    //Permission Checking:
    const allowedMembers = ['299458729366126592', '694219054428192789', '393889222496616468', '457517248786202625', '199576460434997248']
    if (message.guild.id === '757346743598710866' && !allowedMembers.includes(message.author.id)) {
      return message.reply({ content: '<:SHUT:796516010702143548>' })
    }


    //Variables:
    let mapList = ['Haven', 'Icebox', 'Split', 'Ascent', 'Bind', 'Breeze']
    let mapDatabase = {
      'Haven': ['#AC7973', 'https://static.wikia.nocookie.net/valorant/images/7/70/Loading_Screen_Haven.png/revision/latest?cb=20200620202335'],
      'Icebox': ['#3B619D', 'https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png/revision/latest?cb=20201015084446'],
      'Split': ['#9FAD99', 'https://static.wikia.nocookie.net/valorant/images/d/d6/Loading_Screen_Split.png/revision/latest?cb=20200620202349'],
      'Ascent': ['#A46168', 'https://static.wikia.nocookie.net/valorant/images/e/e7/Loading_Screen_Ascent.png/revision/latest?cb=20200607180020'],
      'Bind': ['#A4836A', 'https://static.wikia.nocookie.net/valorant/images/2/23/Loading_Screen_Bind.png/revision/latest?cb=20200620202316'],
      'Breeze': ['#15BFE6', 'https://static.wikia.nocookie.net/valorant/images/1/10/Loading_Screen_Breeze.png/revision/latest?cb=20210427160616'],
    }


    if (args.length !== 0) {//Args Processing
      if (args[0] === 'sz') {
        mapList.splice(5, 1)
      }
      else if (args[0] === ('n' || 'not')) {
        for (let i = 1; i < args.length; i++) {
          const x = args[i].slice(0, 1).toUpperCase() + args[i].slice(1, args[i].length).toLowerCase()
          if (!mapDatabase[x]) {
            return message.reply({ content: 'Please make sure you entered valid maps with correct spelling.' })
          }
          mapList = mapList.filter(map => map !== x)
        }
      }
      else if (args.length < 2) {
        return message.reply({ content: 'You must specify at least 2 maps.' })
      }
      else {
        mapList = []
        for (let i = 0; i < args.length; i++) {
          let x = args[i].slice(0, 1).toUpperCase() + args[i].slice(1, args[i].length).toLowerCase()
          if (!mapDatabase[x]) {
            return message.reply({ content: 'Please make sure you entered valid maps with correct spelling.' })
          }
          if (mapList.includes(x)) continue;
          mapList.push(x)
        }
      }
    }
    const randomNum = Math.floor(Math.random() * mapList.length)
    const chosenMap = mapList[randomNum]
    const embed = new Discord.MessageEmbed()
      .setTitle('And your map is....' + chosenMap + '!')
      .setColor(mapDatabase[chosenMap][0])
      .setImage(mapDatabase[chosenMap][1])
      .setFooter('Enjoy the game! | Requested by ' + message.author.tag)
    return message.reply({ embeds: [embed] })
  }
}