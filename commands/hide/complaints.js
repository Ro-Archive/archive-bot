const Discord = require('discord.js');

module.exports = {
  name: 'complaints',
  description: 'Report any complaints to the bot owner',
  execute(message, args) {
    // Check if message comes from a guild
    if (!message.guild) {
      return message.reply('This command can only be used in a server.');
    }

    // Check if user is server owner
    if (message.author.id !== message.guild.ownerID) {
      return message.reply('Only the server owner can use this command.');
    }

    const userMessage = message.content.replace('.complaints', '').trim();
    const channelId = '1091916864218730618';
    const channel = message.client.channels.cache.get(channelId);

    if (!channel) {
      return message.reply(`There was an error while sending your complaint. Please try again later. or contact the owner \`${message.guild.owner.user.tag}\``);
    }

    let attachments = message.attachments.filter(attachment => {
      const attachmentType = attachment.url.split('.').pop().toLowerCase();
      return attachmentType === 'png' || attachmentType === 'jpeg';
    });

    if (attachments.length === 0 && !userMessage) {
      return message.reply(`Please attach a JPEG or PNG file, or include a message, to your complaint.`);
    }

    const invalidAttachments = message.attachments.filter(attachment => {
      const attachmentType = attachment.url.split('.').pop().toLowerCase();
      return attachmentType !== 'png' && attachmentType !== 'jpeg';
    });

    if (invalidAttachments.length > 0) {
      return message.reply(`Invalid attachment type. Please attach a JPEG or PNG file to your complaint.`);
    }

    const attachmentUrls = attachments.map(attachment => attachment.url);

    let complaintMessage = `Complaint from Server Owner \`${message.author.tag}\` from in the Server \`${message.guild.name}\``;

    if (userMessage) {
      complaintMessage += `: ${userMessage}`;
    }

    if (attachmentUrls.length > 0) {
      complaintMessage += `\n\nAttachments:\n${attachmentUrls.join('\n')}`;
    }

    complaintMessage += `\n\nPlease take action on this complaint as soon as possible.`;

    channel.send(complaintMessage)
      .then(() => {
        message.reply('Your complaint has been received. We will look into it soon.');
      })
      .catch((error) => {
        console.error(`Error while sending complaint message: ${error.message}`);
        message.reply(`There was an error while sending your complaint. Please try again later. or contact the owner \`${message.guild.owner.user.tag}\``);
      });
  },
};