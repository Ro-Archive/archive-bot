const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
  {
    name: 'audio',
    description: 'Fetch and send audio',
    type: 1,
    options: [
      {
        name: 'assetid',
        description: 'The asset ID of the audio',
        type: 3, // String
        required: true,
      },
      {
        name: 'placeid',
        description: 'The place ID',
        type: 3, // String
        required: true,
      },
    ],
  },
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('your activity message here');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'audio') {
    const assetId = options.getString('assetid');
    const placeId = options.getString('placeid');

    if (!assetId || !placeId) {
      await interaction.reply('Please provide both the asset ID and place ID.');
      return;
    }

    try {
      // Fetch and send audio (modify the command.execute function accordingly)
      await command.execute(interaction, [assetId, placeId]);
    } catch (error) {
      console.error(error);
      await interaction.reply('Error fetching audio.');
    }
  }
});

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const botToken = 'bot_token_here';

// Create a REST client for registering slash commands
const rest = new REST({ version: '10' }).setToken(botToken);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('client_here', 'guild_here'), // Replace with your client ID and guild ID
      {
        body: commands,
      }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Login to Discord with your bot's token
client.login(botToken);