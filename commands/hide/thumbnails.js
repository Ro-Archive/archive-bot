const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'thumbnails',
  description: 'Game thumbnails and YouTube videos of a universe Id',
  execute(message, args) {
    const universeId = args[0];

    fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          const gameData = json.data[0];
          const gameName = gameData.name;

          fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=100&defaults=true&size=480x270&format=Png&isCircular=false`)
            .then((res) => res.json())
            .then((json) => {
              if (json.data && json.data.length > 0) {
                const data = json.data[0];
                const thumbnails = data.thumbnails;

                if (thumbnails && thumbnails.length > 0) {
                  for (let i = 0; i < thumbnails.length; i++) {
                    const thumbnailUrl = thumbnails[i].imageUrl;
                    const exampleEmbed = new Discord.MessageEmbed()
                      .setTitle(`Game thumbnails for ${gameName}`)
                      .setImage(thumbnailUrl)
                      .setURL(thumbnailUrl)
                      .setDescription(`Thumbnail ${i + 1}/${thumbnails.length}`);

                    message.channel.send(exampleEmbed);
                  }
                } else {
                  message.channel.send('No game thumbnails found for this universe ID');
                }
              } else {
                message.channel.send('No game data found for this universe ID');
              }
            });

          fetch(`https://games.roblox.com/v2/games/${universeId}/media`)
            .then(res => res.json())
            .then(json => {
              const youtubeVideos = json.data.filter(media => media.assetType === "YouTubeVideo");
              if (youtubeVideos.length > 0) {
                for (let i = 0; i < youtubeVideos.length; i++) {
                  const videoHash = youtubeVideos[i].videoHash;
                  const youtubeUrl = `https://www.youtube.com/watch?v=${videoHash}`;
                  message.channel.send(youtubeUrl);
                }
              } else {
                message.channel.send('No YouTube videos found for this game');
              }
            });
        } else {
          message.channel.send('Not a valid Universe ID');
        }
      });
  },
};