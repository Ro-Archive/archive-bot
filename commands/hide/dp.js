const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'dp',
  description: 'Display developer products for a specific universe.',
  async execute(message, args) {
    const universeId = args[0];

    let gameName;
    let developerProducts = [];

    // Your Roblox cookie (replace with your actual cookie)
    const robloxCookie = 'token_here';

    // Get game name and developer products
    try {
      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`, {
        headers: {
          'User-Agent': 'Roblox/WinInet',
          'Content-Type': 'application/json',
          Cookie: robloxCookie,
        },
      });
      const gameData = await gameResponse.json();
      if (!gameData.data || gameData.data.length === 0) {
        throw new Error('No game data found.');
      }
      gameName = gameData.data[0].name;

      const developerProductResponse = await fetch(`https://apis.roblox.com/developer-products/v1/universes/${universeId}/developerproducts?pageSize=9999&pageNumber=1`, {
        headers: {
          'User-Agent': 'Roblox/WinInet',
          'Content-Type': 'application/json',
          Cookie: robloxCookie,
        },
      });

      // Check if the response content type is JSON
      const contentType = developerProductResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const developerProductData = await developerProductResponse.json();
        if (!developerProductData.data || developerProductData.data.length === 0) {
          throw new Error('No developer products found.');
        }
        developerProducts = developerProductData.data;
      } else {
        // Handle non-JSON response (print as is or perform other actions)
        const nonJsonResponse = await developerProductResponse.text();
        console.log('Non-JSON Response:');
        console.log(nonJsonResponse); // Print the non-JSON response
      }
    } catch (err) {
      console.error('Error:', err.message);
      message.channel.send('No developer products found.');
      return;
    }

    // Send message indicating the number of developer products processing
    const processingMessage = await message.channel.send(`Processing **${gameName}** developer products, might take some time...`);

    // Create an embed for each developer product
    for (let i = 0; i < developerProducts.length; i++) {
      const developerProduct = developerProducts[i];
      const { name } = developerProduct;

      try {
        const developerProductEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(name)
          .setURL(`https://www.roblox.com/develop/${universeId}`)
          .setFooter(`Game Name: ${gameName} / Universe ID: ${universeId}`);

        message.channel.send(developerProductEmbed);

        // Delete the "processing" message after the last developer product
        if (i === developerProducts.length - 1) {
          processingMessage.delete();
        }
      } catch (err) {
        console.error('Error creating developer product embed:', err.message);
        message.channel.send('Error creating developer product embed');
      }
    }
  },
};
