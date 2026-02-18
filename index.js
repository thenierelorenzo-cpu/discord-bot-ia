require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder, 
    REST, 
    Routes, 
    EmbedBuilder 
} = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

const commands = [
    new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Envoie un embed personnalisé')
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('Le texte')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Lien de l\'image')
                .setRequired(false))
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );
})();

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'embed') {
        const texte = interaction.options.getString('texte');
        const image = interaction.options.getString('image');

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription(texte);

        if (image) embed.setImage(image);

        await interaction.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
