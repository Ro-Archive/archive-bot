const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'sibplace',
  description: "gets sibling places for an experience",
  execute(message, args) {
    const baseEmbed = new Discord.MessageEmbed()
      .setTitle('Sibling Places')
      .setFooter('LeakBot', 'https://cdn.discordapp.com/attachments/1079623735306375268/1086902952448503868/Png.png');

    const universeId = args[0];

    fetch(`https://develop.roblox.com/v1/universes/${universeId}/places?sortOrder=Asc&limit=100`)
      .then(res => res.json())
      .then(json => {
        const places = json.data;

        for (let i = 0; i < places.length; i++) {
          const gamepassLink = `https://www.roblox.com/games/${places[i].id}`;
          baseEmbed.addField(places[i].name, `ID: [${places[i].id}](${gamepassLink})`, true);
        }

        message.channel.send(baseEmbed);
      })
      .catch(err => message.channel.send('Oops, something went wrong!'));
  }
}