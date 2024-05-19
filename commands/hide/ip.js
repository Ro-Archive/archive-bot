const Discord = require('discord.js');
const os = require('os');

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
}

module.exports = {
    name: 'ip',
    description: "this is a ping command!",
    execute(message, args){
      const ipAddress = getIPAddress();
      var helpEmbedOne = {
        "title": "Bot's Ip",
        "description": `**Bot IP Address** - ${ipAddress}`,
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