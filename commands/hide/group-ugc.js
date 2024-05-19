const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'group-ugc',
  description: "This command shows the latest UGC Assets for a given group ID.",
  async execute(message, args) {
    // Create a new embed to display the results
    var exampleEmbed = new Discord.MessageEmbed()
      .setTitle(`Latest UGC Assets for: ${args[0]}`)
      .setFooter('LeakBot', 'https://cdn.discordapp.com/attachments/1079623735306375268/1086902952448503868/Png.png');
    
    // Function to fetch the group and UGC assets data
    async function doCommand() {
      try {
        // Fetch the group name from the group ID
        const groupFetch = await fetch(`https://groups.roblox.com/v2/groups?groupIds=${args[0]}`, {
          headers: {
            'cookie': 'token_here'
          }
        });
        const groupJson = await groupFetch.json();
        const groupName = groupJson.data[0].name;
        exampleEmbed.setTitle(`Latest UGC Assets for ${groupName}`);

        // Fetch the UGC assets from the group
        const ugcAssetsFetch = await fetch(`https://catalog.roblox.com/v2/search/items/details?model.sortType=3&model.IncludeNotForSale=true&model.creatorName=${groupName}&cursor=`);
        const ugcAssetsJson = await ugcAssetsFetch.json();

        if (ugcAssetsJson.data.length > 0) {
          const ugcAssets = ugcAssetsJson.data;

          // Loop through each UGC asset and add it to the embed
          for (var i = 0; i < ugcAssets.length; i++) {
            const ugcId = ugcAssets[i].id;
            const ugcName = ugcAssets[i].name;

            // Fetch the thumbnail for the UGC asset
            const thumbnailFetch = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${ugcId}&returnPolicy=PlaceHolder&size=700x700&format=Png&isCircular=false`);
            const thumbnailJson = await thumbnailFetch.json();
            const thumbnailUrl = thumbnailJson.data[0].imageUrl;

            // Add the thumbnail and UGC name to the embed
            exampleEmbed.setImage(thumbnailUrl);
            exampleEmbed.addField('UGC Name:', ugcName);
            message.channel.send(exampleEmbed);

            // Reset the embed for the next UGC asset
            exampleEmbed = new Discord.MessageEmbed()
              .setFooter('LeakBot', 'https://cdn.discordapp.com/attachments/1079623735306375268/1086902952448503868/Png.png');
          }
        } else {
          message.channel.send(`Sorry, ${groupName} does not have any Catalog Items uploaded.`);
        }
      } catch (error) {
        if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
          message.channel.send('Group has been terminated');
        } else {
          console.error(error);
          message.channel.send('An error occurred while processing the command');
        }
      }
    }

    // Check if a group ID was provided
    if (args[0]) {
      doCommand();
    } else {
      message.channel.send('Please provide a group ID.');
    }
  }
}
