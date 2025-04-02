import 'reflect-metadata';
import {SapphireClient} from '@sapphire/framework';
import {GatewayIntentBits, Partials} from 'discord.js';
import dotenv from 'dotenv';

const client = new SapphireClient({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember
    ],
    loadMessageCommandListeners: true
});

dotenv.config();

client.login(process.env.TOKEN);