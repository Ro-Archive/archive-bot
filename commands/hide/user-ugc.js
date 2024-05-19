const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'user-ugc',
  description: "this command shows the user's latest UGC assets",
  async execute(message, args) {
    var exampleEmbed = new Discord.MessageEmbed()
      .setTitle(`Latest UGC Assets for: ${args[0]}`)
      .setFooter('LeakBot', 'https://cdn.discordapp.com/attachments/1079623735306375268/1086902952448503868/Png.png');

    async function doCommand() {
      try {
        const userFetch = await fetch(`https://users.roblox.com/v1/users/${args[0]}`);
        const userJson = await userFetch.json();
        const username = userJson.name;

        exampleEmbed.setTitle(`Latest UGC Assets for ${username}`);

        const ugcAssetsFetch = await fetch(`https://catalog.roblox.com/v1/search/items/details?Category=ugc&CreatorTargetId=${args[0]}&SortAggregation=5&SortOrder=2&limit=25`);
        const ugcAssetsJson = await ugcAssetsFetch.json();

        if (ugcAssetsJson.data && ugcAssetsJson.data.length > 0) {
          const data = ugcAssetsJson.data;
          const thumbnailUrls = await Promise.all(data.map(async (asset) => {
            const assetFetch = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${asset.id}&returnPolicy=PlaceHolder&size=700x700&format=Png&isCircular=false`);
            const assetJson = await assetFetch.json();
            return assetJson.data[0]?.imageUrl;
          }));

          for (let i = 0; i < data.length; i++) {
            exampleEmbed.addField(data[i].name, `ID: [${data[i].id}](https://www.roblox.com/library/${data[i].id})`, true);
            if (thumbnailUrls[i]) {
              exampleEmbed.setImage(thumbnailUrls[i]);
              exampleEmbed.setDescription(`**Name:** ${data[i].name}\n**ID:** [${data[i].id}](https://www.roblox.com/library/${data[i].id})`);
              message.channel.send(exampleEmbed);
            }
          }
        } else {
          message.channel.send(`Sorry, ${username} does not have any Catalog Items uploaded.`);
        }
      } catch (error) {
        console.error(error);
        message.channel.send('An error occurred while processing the command');
      }
    }

    if (args[0]) {
      doCommand();
    } else {
      message.channel.send('Please provide a user ID.');
    }
  }
}