const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'getbadges',
    description: "Badge for a Universe",
    execute(message, args){
      var exampleEmbed = new Discord.MessageEmbed()
      .setTitle('Unobtainable Universe Badges')
        .setFooter('LeaksBot - SonicLeaks', 'https://cdn.discordapp.com/attachments/997977294851280997/1079625725579104318/SlJzkviT_400x400.jpg');


      var placeId = args[0]
      var universeId
      var data
      
      fetch('https://games.roblox.com/v2/groups/' + groupId + '/games?accessFilter=All&sortOrder=Desc&limit=50')
      .then(res => res.json())
      .then(json => exampleEmbed.setDescription(json.Name))

      fetch('https://games.roblox.com/v2/groups/' + groupId + '/games?accessFilter=All&sortOrder=Desc&limit=50')
      .then(res => res.json())
      .then(json => {
        universeId = json.UniverseId
        fetch('https://badges.roblox.com/v1/universes/'+universeId+'/badges')
        .then(res => res.json())
        .then(json => {
          if(json.data){
            data = json.data

            for (var i = 0; i < data.length; i++) {
              if(data[i].enabled == false){
                gamepassLink = 'https://www.roblox.com/badges/'+data[i].id
                exampleEmbed.addField(data[i].displayName, 'ID: '+'['+data[i].id+']('+gamepassLink+')', true)
              }
            }
            message.channel.send(exampleEmbed)
          }else{
            message.channel.send('Not a valid Place Id')
          }
        })
      })      
    }
}