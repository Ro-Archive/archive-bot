const fetch = require('node-fetch');
const Discord = require('discord.js');



module.exports = {
    name: 'genimage',
    description: "this is a ping command!",
    execute(message, args){
        const image = new Canvas.Goodbye()
          .setUsername("xixi52")
          .setDiscriminator("0001")
          .setMemberCount("140")
          .setGuildName("Server DEV")
          //.setAvatar("https://www.site.com/avatar.jpg")
          .setColor("border", "#8015EA")
          .setColor("username-box", "#8015EA")
          .setColor("discriminator-box", "#8015EA")
          .setColor("message-box", "#8015EA")
          .setColor("title", "#8015EA")
          .setColor("avatar", "#8015EA")
          //.setBackground("https://site.com/background.jpg")
          .toAttachment();
        
        const attachment = new Discord.MessageAttachment(image.toBuffer(), "goodbye-image.png");
        
        message.channel.send(attachment);
        message.channel.send('pong!');
    }
}