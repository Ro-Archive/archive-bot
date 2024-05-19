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
            'cookie': '.ROBLOSECURITY_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_564FE2FD7735377BCDE2F4B99F12302718E198A00DE624854EE6FCB9C693BD64E60BDA212E340EB3210A86CEA7601EF0ECC632F27FB5703DD3FAB4D7D9E35C012CA1FFE2860E22F39B7570921184B89CDF5132CFF704BACF72FBB0C0F81ABC77813530B036F8525C7405486FF0D14126936EB939D210FC7986B29D002B56527710060874542087E4B4041669F69741B2E43E8CCC3E0139185FCD6F542AB7A8336052AED1EAED247BD3FEAC8DE69592C9CFDC3003644CAC6BD7D6C1BD13D469C5A41547879AEF97DFC44A9C2A724672A929491F93B6A5177C1914FDCA346D8BE97B79F1EC57CFB0C6C26F432EF17D83CEDBB856ACFC5CE98D588B3924DE74646E583D6917E05830BB493AD271A354D85AEEE7F98BDE311D4A583182CC22C69A67FE7595770812F4B0C034C6DC1B3882663BE6BCACB75C8B73FB6C77303A0851F05379F40879A659AA5FCC850ED7234016FEFF02CF434821BDAAFC987F2FF56AAA9E165AC8513120CB3F6FC826F7159AC5C70D5679'
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