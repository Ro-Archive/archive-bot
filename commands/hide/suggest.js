const Discord = require('discord.js');

module.exports = {
  name: 'suggest',
  description: 'suggest',
  execute(message, args) {
    const userMessage = message.content.replace('.suggest', '').trim();
    const channelId = '1091920269775487128';
    const channel = message.client.channels.cache.get(channelId);

    if (!channel) {
      return message.reply(`There was an error while sending your suggestion. Please try again later. or contact the owner \`${message.guild.owner.user.tag}\``);
    }

    let attachments = message.attachments.filter(attachment => {
      const attachmentType = attachment.url.split('.').pop().toLowerCase();
      return attachmentType === 'png' || attachmentType === 'jpeg';
    });

    if (attachments.length === 0 && !userMessage) {
      return message.reply(`Please attach a JPEG or PNG file, or include a message, to your suggestion.`);
    }

    const invalidAttachments = message.attachments.filter(attachment => {
      const attachmentType = attachment.url.split('.').pop().toLowerCase();
      return attachmentType !== 'png' && attachmentType !== 'jpeg';
    });

    if (invalidAttachments.length > 0) {
      return message.reply(`Invalid attachment type. Please attach a JPEG or PNG file to your suggestion.`);
    }

    const attachmentUrls = attachments.map(attachment => attachment.url);

    let complaintMessage = `suggestion from Server member \`${message.author.tag}\` from in the Server \`${message.guild.name}\``;

    if (userMessage) {
      complaintMessage += `: ${userMessage}`;
    }

    if (attachmentUrls.length > 0) {
      complaintMessage += `\n\nAttachments:\n${attachmentUrls.join('\n')}`;
    }

    complaintMessage += `\n\n`;

    channel.send(complaintMessage)
      .then(() => {
        message.reply('Your suggestion has been received. Thank you for choosing leakbot :face_holding_back_tears:');
      })
      .catch((error) => {
        console.error(`Error while sending suggestion message: ${error.message}`);
        message.reply(`There was an error while sending your suggestion. Please try again later. or contact the owner \`${message.guild.owner.user.tag}\``);
      });
  },
};