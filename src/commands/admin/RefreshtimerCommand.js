const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');

module.exports = class RefreshtimerCommand extends BaseCommand {
  constructor() {
    super('refreshtimer', 'admin', ['rt'], null, 'Refreshes all the timers in the Subject Zero guild.', 'refreshtimer');
  }

  async run(client, message, args) {
    //Message and Channel Variables:
    if (message && message.author.id !== '393889222496616468') {
      return message.reply({ content: 'Imagine trying to copy a command after seeing someone else use it. Smh.' })
    }
    let aotm = await client.channels.cache.get('828697691826552863').messages.fetch('828701067839143946')
    let marvelm = await client.channels.cache.get('829372485517574164').messages.fetch('835050564097671208')
    let anniversarym = await client.channels.cache.get('829372485517574164').messages.fetch('829625043721650257')
    let birthm = await client.channels.cache.get('829372485517574164').messages.fetch('829959261056532481')
    let bbm = await client.channels.cache.get('829372485517574164').messages.fetch('834387071875416174')

    function birthdayDB() {
      let unixArray = ['1641859200000', '1643241600000', '1643328000000', '1644105600000', '1644969600000', '1645660800000', '1647839940000', '1649977200000', '1650582000000', '1651878000000', '1652050800000', '1652425200000', '1653174000000', '1653433200000', '1656630000000', '1657666800000', '1658790000000', '1659394800000', '1660345200000', '1661814000000', '1662764400000', '1663110000000', '1665702000000', '1670400000000', '1671580800000']
      let unixToVar = {
        0: ['Kishara', 'January 11th', '689583138128527360', 1],
        1: ['Manik', 'January 27th', '514559581083664396', 1],
        2: ['Cerys', 'January 28th', '717705521452548156', 1],
        3: ['Jonny', 'February 6th', '457517248786202625', 1],
        4: ['Dart', 'February 16th', '689561335650189338', 1],
        5: ['Eliyas', 'February 24th', '625760446347214848', 1],
        6: ['Annie', 'March 21st', '823063174378029096', '10:49 IST'],
        7: ['Frankie', 'April 15th', '759408101823741962', 0],
        8: ['Sanjana', 'April 22nd', '689568246097379328', 0],
        9: ['Finley', 'May 7th', '168358122979590145', 0],
        10: ['Armaan', 'May 9th', '464449239162814487', 0],
        11: ['Discord', 'May 13th', null, '00:00 PST'],
        12: ['Elena', 'May 22nd', '761290331777400832', 0],
        13: ['Tulasi', 'May 25th', '694219054428192789', 0],
        14: ['Mathy', 'July 1st', '299458729366126592', 0],
        15: ['James', 'July 13th', '685815186094817310', 0],
        16: ['Alex', 'July 26th', '392735192587960340', 0],
        17: ['Michael', 'August 2nd', '199576460434997248', 0],
        18: ['Tamago', 'August 13th', '571711985805426688', 0],
        19: ['Shreyas', 'August 30th', '485737951050072065', 0],
        20: ['Zahra', 'September 10th', '784836980613709854', 0],
        21: ['Arun', 'September 14th', '351760611497082880', 0],
        22: ['Arnav', 'October 14th', '393889222496616468', '00:00 IST'],
        23: ['Sean', 'December 7th', '399609592017059840', '00:00 PST'],
        24: ['Anousheh', 'December 21st', '689603966128226468', 1],
      }
      let bdayIndex = []
      for (let i = 0; i < unixArray.length; i++) {
        if (unixArray[i] - Date.now() >= 0) {
          bdayIndex = i
          break
        }
      }
      let dict = unixToVar[bdayIndex]
      dict[2] = dict[2] === null ? '' : '(<@' + dict[2] + '>)'
      dict[3] = dict[3] === 0 ? '00:00 BST' : (dict[3] === 1 ? '00:00 GMT' : dict[3])
      let timeLeft = Math.floor((unixArray[bdayIndex] - Date.now()) / 1000)
      let birthtimer = timerArrayVar(timeLeft)
      let birthEmbed = new Discord.MessageEmbed()
        .setColor('#32DC96')
        .setTitle('Birthday Timer! :tada: :tada: :tada:')
        .setDescription('**' + dict[0] + ' ' + dict[2] + '**\n' + dict[1] + ', 2021: ' + dict[3] + '\n <:clock10:585140880508321806> `In ' + birthtimer[4] + 'mo / ' + birthtimer[3] + 'd / ' + birthtimer[2] + 'h / ' + birthtimer[1] + 'm / ' + birthtimer[0] + 's `')
        .setThumbnail('https://cdn.discordapp.com/attachments/665908573783457795/829780406408445982/intro-1566242788_1.jpg')
        .setFooter('Last updated: ')
        .setTimestamp()
      return birthEmbed
    }
    //Time Variables:
    function timerArrayVar(timeLeft) {
      let myArray = []
      myArray[0] = Math.floor(timeLeft % 60)
      myArray[1] = Math.floor((timeLeft / 60) % 60)
      myArray[2] = Math.floor((timeLeft / (60*60)) % 24)
      myArray[3] = Math.floor((timeLeft / (60*60*24)) % 30.42)
      myArray[4] = Math.floor((timeLeft / (60*60*24*30.42)) % 12)
      return myArray
    }
    function ordnum(i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
          return i + "st";
      }
      if (j == 2 && k != 12) {
          return i + "nd";
      }
      if (j == 3 && k != 13) {
          return i + "rd";
      }
      return i + "th";
    }
    async function aotupdateEmbed() {
      const aottimeLeft = Math.floor((1641827100000 - Date.now()) / 1000)
      if (aottimeLeft <= 0) return;
      const aottimer = timerArrayVar(aottimeLeft)
      const aottimerEmbed = new Discord.MessageEmbed()
          .setImage('https://cdn.discordapp.com/attachments/665908573783457795/828670316750307368/ezgif.com-gif-maker_1.gif')
          .setColor('#D93870')
          .setTitle('Attack on Titan Season 4 Part 2 will start airing on:')
          .setDescription('January 10th, 2022: 12:05 JST\* \n <:clock10:585140880508321806> `In ' + aottimer[4] + 'mo / ' + aottimer[3] + 'd / ' + aottimer[2] + 'h / ' + aottimer[1] + 'm / ' + aottimer[0] + 's `')
          .setFooter('\*Date has now been confirmed.')
          .setTimestamp();
      await aotm.edit({ embeds: [aottimerEmbed] })
    }

    async function marvelupdateEmbed() {
      const marveltimestamp = 1636095600000
      const marveltimer = timerArrayVar(Math.floor((marveltimestamp - Date.now()) / 1000))
      if (marveltimestamp - Date.now() <= 0) return;
      const marvelDate = new Date(marveltimestamp)      
      const marveltimerEmbed = new Discord.MessageEmbed()
          .setImage('https://m.media-amazon.com/images/M/MV5BZmUyYzNkYjktYWJiZC00N2I4LWEzNjItMzZjYTdkOTkyY2UyXkEyXkFqcGdeQVRoaXJkUGFydHlJbmdlc3Rpb25Xb3JrZmxvdw@@._V1_.jpg')
          .setColor('#D93870')
          .setTitle('Eternals will release on:')
          .setDescription(marvelDate.toLocaleString('default', { month: 'long' }) + ' ' + ordnum(marvelDate.getDate()) + ', 2021: 00:00 PDT\* \n <:clock10:585140880508321806> `In ' + marveltimer[4] + 'mo / ' + marveltimer[3] + 'd / ' + marveltimer[2] + 'h / ' + marveltimer[1] + 'm / ' + marveltimer[0] + 's `')
          .setFooter('Last updated:')
          .setTimestamp();
      await marvelm.edit({ embeds: [marveltimerEmbed] })
    }

    async function anniversaryupdateEmbed() {
      const anniversarytimeLeft = Math.floor((1663794334000 - Date.now()) / 1000)
      if (anniversarytimeLeft <= 0) return;
      const anniversarytimer = timerArrayVar(anniversarytimeLeft)
      const anniversarytimerEmbed = new Discord.MessageEmbed()
          .setColor('#5B91B5')
          .setThumbnail('https://cdn.discordapp.com/attachments/725714640289398906/787328452356735026/original.jpg')
          .setTitle('Two year anniversary of Subject Zero!')
          .setDescription('September 20th, 2022: 21:05 GMT\* \n <:clock10:585140880508321806> `In ' + anniversarytimer[4] + 'mo / ' + anniversarytimer[3] + 'd / ' + anniversarytimer[2] + 'h / ' + anniversarytimer[1] + 'm / ' + anniversarytimer[0] + 's `')
          .setFooter('Last updated: ')
          .setTimestamp();
      await anniversarym.edit({ embeds: [anniversarytimerEmbed] })
    }

    async function birthupdateEmbed() {
      const birthEmbed = birthdayDB()
      await birthm.edit({ embeds: [birthEmbed] })
    }

    async function bbupdateEmbed() {
      const bbtimeLeft = Math.floor((1634425200000 - Date.now()) / 1000)
      if (bbtimeLeft <= 0) return;
      const bbtimer = timerArrayVar(bbtimeLeft)
      const bbtimerEmbed = new Discord.MessageEmbed()
        .setImage('https://cdn.discordapp.com/attachments/665908573783457795/834390425217400863/161900340618705172_1.png')
        .setColor('#000000')
        .setTitle('The next chapter (Chapter 181) of Black Butler will be published on:')
        .setDescription('October 17th, 2021: 00:00 BST\* \n <:clock10:585140880508321806> `In ' + bbtimer[4] + 'mo / ' + bbtimer[3] + 'd / ' + bbtimer[2] + 'h / ' + bbtimer[1] + 'm / ' + bbtimer[0] + 's `')
        .setFooter('\*Disclaimer: Earliest possible date; exact date unknown.')
        .setTimestamp()
      await bbm.edit({ embeds: [bbtimerEmbed] })
    }
    if (message) {
      message.delete();
    }
    
    function refreshTimer() {
      aotupdateEmbed();
      marvelupdateEmbed();
      anniversaryupdateEmbed();
      birthupdateEmbed();
      bbupdateEmbed();
    }
    function repeatTimer() {
      setInterval(() => {
        refreshTimer();
      }, 600000);
    } 
    refreshTimer();
    return repeatTimer();
  }
}