const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'game-passes',
  description: 'Display game passes for a specific universe.',
  async execute(message, args) {
    const universeId = args[0];

    let gameName;
    let gamePasses = [];
    let processedGamePassIds = [];

    // Get game name and game passes
    try {
      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      const gameData = await gameResponse.json();
      if (!gameData.data || gameData.data.length === 0) {
        throw new Error('No game data found.');
      }
      gameName = gameData.data[0].name;

      const gamePassResponseAsc = await fetch(`https://games.roblox.com/v1/games/${universeId}/game-passes?sortOrder=Asc`);
      const gamePassDataAsc = await gamePassResponseAsc.json();
      if (!gamePassDataAsc.data || gamePassDataAsc.data.length === 0) {
        throw new Error('No game passes found.');
      }
      gamePasses = gamePassDataAsc.data;

      const gamePassResponseDesc = await fetch(`https://games.roblox.com/v1/games/${universeId}/game-passes?sortOrder=Desc`);
      const gamePassDataDesc = await gamePassResponseDesc.json();
      if (!gamePassDataDesc.data || gamePassDataDesc.data.length === 0) {
        throw new Error('No game passes found.');
      }
      gamePasses = gamePasses.concat(gamePassDataDesc.data);

    } catch (err) {
      console.error(err);
      message.channel.send('No game passes found.');
      return;
    }

    // Send message indicating number of game passes processing
     const processingMessage = await message.channel.send(`Processing **${gameName}** game passes, Might take some time...`);
    // Create embed for each game pass
for (let i = 0; i < gamePasses.length; i++) {
  const gamePass = gamePasses[i];
  const { id, name, price } = gamePass;

  if (processedGamePassIds.includes(id)) {
    // Game pass already processed, skip it
    continue;
  }

  processedGamePassIds.push(id);

  const priceString = price ? `${price} Robux` : 'Off-Sale';

  try {
    const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${id}&size=150x150&format=Png&isCircular=false`);
    const thumbnailData = await thumbnailResponse.json();
    if (!thumbnailData.data || thumbnailData.data.length === 0) {
      throw new Error('No thumbnail found.');
    }
    const thumbnailUrl = thumbnailData.data[0].imageUrl;

    const gamePassEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(name)
      .setURL(`https://www.roblox.com/game-pass/${id}`)
      .addField('Price', priceString, true)
      .setThumbnail(thumbnailUrl)
      .setFooter(`Game Name: ${gameName} / Universe ID: ${universeId}`);

    message.channel.send(gamePassEmbed);

    // Delete "processing" message after the last game pass
    if (i === gamePasses.length - 1) {
      processingMessage.delete();
    }
  } catch (err) {
    console.error(err);
    message.channel.send('Error fetching thumbnail data');
      }
    }
  },
};