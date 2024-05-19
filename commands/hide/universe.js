const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'universe',
  description: "gets the universe ID for a given Roblox place ID",
  execute(message, args) {
    const baseEmbed = new Discord.MessageEmbed()
      .setTitle('Universe ID')
      .setFooter('LeakBot', 'https://cdn.discordapp.com/attachments/1079623735306375268/1086902952448503868/Png.png');

    const placeId = args[0];

    fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
      .then(res => res.json())
      .then(json => {
        const universeId = json.universeId;
        if (universeId == null) {
          throw new Error('You have requested a universe ID with a universe ID and not a PlaceId.');
        }
        baseEmbed.addField('Universe ID', universeId, true);

        // Check if the message was sent in a server channel
        if (message.channel.type === 'text') {
          // Send the message to the same channel as the original message
          message.channel.send(baseEmbed);
        } else {
          // Send the message to the DM channel
          message.author.send(baseEmbed);
        }
      })
      .catch(err => {
        // Check if the message was sent in a server channel
        if (message.channel.type === 'text') {
          // Send the error message to the same channel as the original message
          message.channel.send('Oops, something went wrong! ' + err.message);
        } else {
          // Send the error message to the DM channel
          message.author.send('Oops, something went wrong! ' + err.message);
        }
      })
      .catch(err => {
        // Check if the message was sent in a server channel
        if (message.channel.type === 'text') {
          // Send the error message to the same channel as the original message
          message.channel.send('Oops, something went wrong! ' + err.message);
        } else {
          // Send the error message to the DM channel
          message.author.send('Oops, something went wrong! ' + err.message);
        }
      });
  }
}