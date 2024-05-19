const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'gameicon',
  description: 'Game Icon of a place Id',
  execute(message, args) {
    const exampleEmbed = new Discord.MessageEmbed().setTitle('Game Icon');

    const placeId = args[0];

    fetch(
      `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&returnPolicy=PlaceHolder&size=256x256&format=Png&isCircular=false`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const data = json.data[0];

          if (data.imageUrl) {
            exampleEmbed.setImage(data.imageUrl);
            exampleEmbed.setURL(data.imageUrl);
          }

          message.channel.send(exampleEmbed);
        } else {
          message.channel.send('Not a valid Place ID');
        }
      });
  },
};