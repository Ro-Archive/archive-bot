const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'gg',
  description: "Gets the top 50 Unavalible games from a group",
  execute(message, args) {

    var exampleEmbed = new Discord.MessageEmbed()
      .setTitle('Latest Private/Public Group Games')
      .setFooter('LeakBot', 'https://cdn.discordapp.com/attachments/1079623735306375268/1086902952448503868/Png.png');

    var groupId = args[0];
    var pageNum = args[1];

    fetch('https://groups.roblox.com/v1/groups/' + groupId)
      .then(res => res.json())
      .then(json => exampleEmbed.setDescription(json.name))
      .catch(err => {})

    fetch('https://games.roblox.com/v2/groups/' + groupId + '/games?accessFilter=All&sortOrder=Desc&limit=50')
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          data = json.data

          for (var i = 0; i < data.length; i++) {
            gamepassLink = 'https://www.roblox.com/games/' + data[i].rootPlace.id
            exampleEmbed.addField(data[i].name, 'ID: ' + '[' + data[i].rootPlace.id + '](' + gamepassLink + ')' + ', Place Visits: ' + data[i].placeVisits, true)
          }

          message.channel.send(exampleEmbed);
        } else {
          message.channel.send('Not a valid Group ID');
        }
      });
  }
}