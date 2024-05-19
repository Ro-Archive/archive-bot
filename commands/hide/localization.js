const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'localization',
  description: 'Gets a Roblox asset by ID and embeds it in the message as an attachment',
  execute(message, args) {
    const assetId = args[0];

    fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`)
      .then((res) => res.text())
      .then((text) => {
        const data = JSON.parse(text);
        if (!data) {
          throw new Error('Error parsing JSON data');
        }
        const translationMapping = data.translationMapping
          .filter((mapping) => typeof mapping.source === 'string' && mapping.source.trim() !== '' && mapping.source !== '""')
          .map(({ source }) => source);

        // Remove '[' and ',' from the JSON string
        const jsonString = JSON.stringify(translationMapping, null, 2)
          .replace(/\[/g, '')
          .replace(/,/g, '');

        // Remove the `{"source": "` prefix and `/` suffix from each item in the array
        const modifiedJsonString = jsonString
          .replace(/{"source": "/g, '')
          .replace(/\\/g, '') // Remove all backslashes
          .replace(/""/g, '"') // Replace all occurrences of "" with a single "
          .trim() // Trim any leading/trailing white space
          + '\n\n"Thank you for using LeakBot by Ghosty ツ#6477"';

        // Write the modified data to a new file
        const filename = `localizationTable-${assetId}.json`;
        fs.writeFileSync(filename, modifiedJsonString);

        // Create a new Discord message attachment from the file
        const attachment = new Discord.MessageAttachment(filename);

        // Send the attachment to the Discord channel
        message.channel.send(attachment).then(() => {
          // Delete the file
          fs.unlinkSync(filename);
        });
      })
      .catch((err) => {
        console.error(err);
        message.channel.send('Error fetching asset data');
      });
  },
};