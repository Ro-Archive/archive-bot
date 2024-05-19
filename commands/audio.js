const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');
const querystring = require('querystring');

async function getAudiosLocations(idArray, placeId) {
  if (!placeId) {
    throw new Error('Missing place ID parameter');
  }

  let bodyArray = [];
  let toReturn = [];

  idArray.forEach(function(id, _) {
    bodyArray.push({
      "assetId": id,
      "assetType": "Audio",
      "requestId": "0"
    });
  });

  let response = await fetch('https://assetdelivery.roblox.com/v2/assets/batch', {
    method: "POST",
    headers: {
      "User-Agent": "Roblox/WinInet",
      "Content-Type": "application/json",
      "Cookie": ".ROBLOSECURITY=token_here",
      "Roblox-Place-Id": placeId,
      "Accept": "*/*",
      "Roblox-Browser-Asset-Request": "false"
    },
    body: JSON.stringify(bodyArray)
  });

  if (response.status == 200) {
    let locations = await response.json();
    locations.forEach(async function(obj, index) {
      if (obj["locations"] && obj.locations[0]["location"]) {
        toReturn.push({
          "assetId": bodyArray[index].assetId,
          "url": obj.locations[0].location
        });
      }
    });
  } else {
    throw new Error('Failed to fetch audio locations');
  }

  return toReturn;
}

module.exports = {
  name: 'audio',
  description: 'audio',
  async execute(message, args) {
    const assetId = args[0];
    const placeId = args[1];

    if (!assetId || !placeId) {
      return message.channel.send('Please provide both the asset ID and place ID');
    }

    try {
      const audioLocations = await getAudiosLocations([assetId], placeId);

      if (audioLocations.length === 0) {
        return message.channel.send(`The place with ID ${placeId} does not have the audio with ID ${assetId} connected.`);
      }

      const audioUrl = audioLocations[0].url;

      const response = await fetch(audioUrl);

      if (!response.ok) {
        throw new Error('Failed to download audio file');
      }

      const audioBuffer = await response.buffer();
      const fileName = `${assetId}.ogg`; // Rename the file with the asset ID

      // Write the audio buffer to a file
      fs.writeFileSync(fileName, audioBuffer);

      // Send the audio file as an attachment
      message.channel.send('Here is the audio:', {
        files: [fileName]
      }).then(() => {
        // After sending, delete the file
        fs.unlinkSync(fileName);
      });
    } catch (err) {
      console.error(err);
      message.channel.send('Error fetching audio');
    }
  }
};