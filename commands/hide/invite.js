const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    description: "this is a ping command!",
    execute(message, args){
      var helpEmbedOne = {
        "title": "Invite To The Server",
        "description": "**Link** - https://discord.gg/hHYMXEdqWY",
        "color": 0x9932CC,
        "thumbnail": {
          "url": "https://cdn.discordapp.com/attachments/1079623735306375268/1086902952448503868/Png.png"
        }
      }

      message.channel.send({ embed: helpEmbedOne })
        .then(() => {
          // Log the bot's response
          console.log(`LeakBot responded to user ${message.author.tag} with an invite to the server.`);
        })
        .catch(error => {
          console.error(`Could not send the invite message to user ${message.author.tag}. Error: ${error}`);
        });
    }
}