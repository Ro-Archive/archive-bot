const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: "Displays a list of available bot commands.",
  execute(message, args) {
    const generalCommandsEmbed = {
      title: 'Bot Help',
      description: '`LeakBot Is a Exclusive Discord tool that allows users to view private & Public UGC from Users & View Private & Public Gamepasses!`',
      color: 0x9932CC,
      thumbnail: {
        url: 'https://cdn.discordapp.com/attachments/1079623735306375268/1087900059674361896/Png_2.png'
      },
      fields: [
        {
          name: '.gg {GroupID}',
          value: 'Displays the top 50 or 25 most recent games by a group.',
          inline: false
        },
        {
          name: '..group-ugc {GroypID}',
          value: 'Displays the top 50 most recent catalog items by a group.',
          inline: false
        },
        {
          name: '.universe {PlaceID}',
          value: 'gets the universe ID for a given Roblox place ID.',
          inline: false
        },
        {
          name: '.sibplace {UniverseID}',
          value: 'Displays the top 100 most recent sibling places.',
          inline: false
        },
        {
          name: '.gameicon {PlaceID}',
          value: 'Displays the game icon.',
          inline: false
        },
        {
          name: '.thumbnails {UniverseID}',
          value: 'Displays all Game thumbnails of a universe Id.',
          inline: false
        },
        {
          name: '.localization {AssetID}',
          value: 'Displays an entire localization table using its asset id.',
          inline: false
        },
        {
          name: '.audio {AssetID} {PlaceID}',
          value: 'It would send u the audio file of a specific audio from the asset id.',
          inline: false
        },
        {
          name: '.game-passes {UniverseID}',
          value: 'Displays entire games gamepasses that is connected to the UniverseID.',
          inline: false
        },
        {
          name: '.likecount {UniverseID}',
          value: 'Displays entire games like count.',
          inline: false
        },
        {
          name: '.suggest {Your_Message}',
          value: 'Same as complaints command u can use this to suggest New commands and & Bot Updates!',
          inline: false
        },
        {
          name: '.invite',
          value: 'Displays an invite to our server.',
          inline: false
        }
      ]
    };

    const ownerCommandsEmbed = {
      title: 'Owner Commands',
      description: '`These are the commands that only the server owner can use!`',
      color: 0xFFA500,
      fields: [
        {
          name: '.complaints {Your_Message}',
          value: 'It would send ur complaint if u have any to #deleted-channel for me and almost everyone to look at so i can fix the issue either the same day or week!',
          inline: false
        }
      ]
    };

    message.channel.send({ embed: generalCommandsEmbed });
    message.channel.send({ embed: ownerCommandsEmbed });
  }
}