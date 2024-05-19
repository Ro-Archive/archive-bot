const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'badges',
  description: 'Display badges for a specific universe.',
  async execute(message, args) {
    const universeId = args[0];

    let universeName;
    let badges = [];
    let processedBadgeIds = [];

    try {
      const universeResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      const universeData = await universeResponse.json();
      if (!universeData.data || universeData.data.length === 0) {
        throw new Error('No universe data found.');
      }
      universeName = universeData.data[0].name;

      const badgesResponseAsc = await fetch(`https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&sortOrder=Asc`);
      const badgesDataAsc = await badgesResponseAsc.json();
      if (!badgesDataAsc.data || badgesDataAsc.data.length === 0) {
        throw new Error('No badges found or You inserted a place id instead of a universe id.');
      }
      badges = badgesDataAsc.data;

      const badgesResponseDesc = await fetch(`https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&sortOrder=Desc`);
      const badgesDataDesc = await badgesResponseDesc.json();
      if (!badgesDataDesc.data || badgesDataDesc.data.length === 0) {
        throw new Error('No badges found.');
      }
      badges = badges.concat(badgesDataDesc.data);

    } catch (err) {
      console.error(err);
      message.channel.send('No badges found or You inserted a place id instead of a universe id.');
      return;
    }

    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i];
      const { id, name, description, enabled, created, updated } = badge;

      if (processedBadgeIds.includes(id)) {
        continue;
      }

      processedBadgeIds.push(id);

      const descriptionString = description || 'N/A';

      try {
        const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${id}&size=150x150&format=Png&isCircular=false`);
        const thumbnailData = await thumbnailResponse.json();
        if (!thumbnailData.data || thumbnailData.data.length === 0) {
          throw new Error('No thumbnail found.');
        }
        const thumbnailUrl = thumbnailData.data[0].imageUrl;

        const badgeEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(name)
          .setURL(`https://www.roblox.com/badges/${id}`)
          .addField('Description', descriptionString)
          .addField('Obtainable', enabled ? 'Yes' : 'No')
          .addField('Created', `\`${new Date(created).toLocaleString()}\``)
          .addField('Last Updated', `\`${new Date(updated).toLocaleString()}\``)
          .setThumbnail(thumbnailUrl)
          .setFooter(`Universe Name: ${universeName} / Universe ID: ${universeId}`);

      message.channel.send(badgeEmbed);

    } catch (err) {
      console.error(err);
      message.channel.send('Error fetching data');
      }
    }
  },
};