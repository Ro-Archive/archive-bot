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
    const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_FB90CE8E58FF14828C25D732D9FA6E75DA347F2C9A0D2BA3A2EE34A31F0E8E12C2C1F3D21CE21E96E71B6629E86C3A80A06158F73FE624E6458292E5871868F4E9E7ECD401116267B0E3C4A382A9081E92D273F2CFD4C383DD4BE5388FAAB5CEDB6FA63C62C2F4C92B88F77A80AA7B64451669DC937DDC9A11F6E4C0464EAAC38B6F17DD53A2E9E5EAACCB8F0E11B90DB3C7386EC38BD69635BA21420F81EF17E3BB112793A4A91D235689CAE2CFD0503647A3D582370E395FD43984FEAE499BB788854367F9F8B6CE07DB303EE691DC960F30017C40F9B117FFFE668B2A4F6F32599D06A5D133B8A91443D57CD5CCC30D32F479215740B2C3A89FCF6190B5CF00DC669579DC5C2DED65916D07A1FFA27758EAC1AE265E97541F0E5EDD308B449CD52DB69FC297F4CB56C2E713EE506887FC00005BA4888E252B92E735DB17714971D8FE12E692BDC6B64BE903C86AC25FD74E1C79F98A698ABEB99EF713DBC29353ACE07DF0E742D0E60C194E6DB70241E7800F031295D743B706CA4E62EE720D8640211D4DD7557F0A588C465954AA76DE19CFCAA5D4E541DAB36FB7AE1A4EBE13F84B9F4775B574382FEA5E41219479CB4AB85F5FD3051A6EFBBD2F7C5BD44715B28C';

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