const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')

module.exports = class DejiCommand extends BaseCommand {
  constructor() {
    super('deji', 'fun', [], 'Dejifies the entire server. Only usable in the Subject Zero guild.', 'deji');
  }

  async run(client, message, args) {
    //Permission Checking:
    if ((message.author.id !== "393889222496616468" && message.author.id !== "351760611497082880") || message.guild.id !== "757346743598710866") {
      return message.reply({ content: "You're an idiot, you're honestly an idiot. I don’t know what's wrong with you. It’s like your brain, your brain doesn’t f#^+ing work." })
    }
    
    //Variables
    let messageToSay = "Long Live Deji 👑"
    if (args.join(" ").length > 0) {
      messageToSay = args.join(" ")
    }
    const categories = ["757362824946384907", "814166073419104346", "797085178114998294", "826153962108485703", "808705180345565215", "810887861930688564"]


    message.delete();
    let c = await message.guild.channels.fetch()
    c = c.filter(ch => ch.type === "GUILD_CATEGORY")
    c.each(ch => {
      if (!categories.includes(ch.id)) {
        ch.children.each(async t => {
          if (!['898690060352880640', '822910149966037002', '830690849373290496', '823474237607510016'].includes(t.id)) {
            await t.send(messageToSay)
          }
        })
      }
    })
  }
}