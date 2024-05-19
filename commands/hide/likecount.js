const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'likecount',
  description: "testing",
  async execute(message, args){
    const baseEmbedd = new Discord.MessageEmbed()
      .setTitle('Like Count')
      .setFooter('LeakBot', 'https://media.discordapp.net/attachments/1079623735306375268/1086902952448503868/Png.png');

    const universeId = args[0];

    try {
      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      const gameData = await gameResponse.json();
      const gameName = gameData.data[0].name;

      const votesResponse = await fetch(`https://games.roblox.com/v1/games/votes?universeIds=${universeId}`);
      const votesData = await votesResponse.json();

      for (let i = 0; i < votesData.data.length; i++) {
        const gamepassLink = `https://www.roblox.com/games/${votesData.data[i].id}`;
        const upVotes = numberWithCommas(votesData.data[i].upVotes);
        const downVotes = numberWithCommas(votesData.data[i].downVotes);
        const totalVotes = numberWithCommas(votesData.data[i].upVotes + votesData.data[i].downVotes);
        baseEmbedd.addField(`Game: ${gameName}`, `ID: [${votesData.data[i].id}](${gamepassLink})\nTotal Votes: ${totalVotes} (${upVotes}👍, ${downVotes}👎)`, true);
      }

      message.channel.send(baseEmbedd);
    } catch (err) {
      console.error(err);
      message.channel.send('An error occurred while fetching the like count.');
    }

    function numberWithCommas(x) {
      if (x >= 1000000) {
        return (x / 1000000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'M';
      } else if (x >= 10000) {
        return (x / 1000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'K';
      } else if (x >= 1000) {
        return (x / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return x;
      }
    }
  }
}