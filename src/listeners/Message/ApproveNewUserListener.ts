import "reflect-metadata"
import { autoInjectable } from "tsyringe";
import { Listener } from '@sapphire/framework';
import { DMChannel, Guild, GuildMember, Message, MessageReaction, User} from "discord.js";
import { ConfigManager } from "../../managers/ConfigManager";
import * as fs from "fs";
import axios from 'axios';

@autoInjectable()
export class ApproveNewUserListener extends Listener {

    public constructor(
        context: Listener.LoaderContext,
        options: Listener.Options,
        protected configManager: ConfigManager,
    ) {
        super(context, {
            ...options,
            event: 'messageReactionAdd'
        });
    }

    public override async run(messageReaction: MessageReaction, user: User) {
        // Verifica che è stata assegnata la reaction per approvare un nuovo utente
        if (messageReaction.emoji.name !== '✅') {
            return;
        }

        // Verifica che la reaction è stata assegnata da un admin
        let guild = await this.configManager.getGuild();
        let memberReact = await guild.members.fetch(user.id);
        let roles = memberReact.roles.valueOf().map(role => role.id);
        if (!roles.includes(this.configManager.getAdminRoleId())) {
            return;
        }

        // Verifica che l'utente esiste
        let memberReacted = messageReaction.message.member;
        if (!memberReacted) {
            return;
        }

        // Verifica che non sia già membro
        roles = memberReacted.roles.valueOf().map(role => role.id);
        if (roles.includes(this.configManager.getMemberRoleId())) {
            return;
        }

        // Aggiunge il ruolo dei membri e toglie quello degli ospiti
        await memberReacted.roles.add(this.configManager.getMemberRoleId());
        await memberReacted.roles.remove(this.configManager.getGuestRoleId());

        // Invia messaggio di approvazione in privato
        try {
            let approvedMessage = fs.readFileSync("messages/approved.md", "utf-8");
            await memberReacted.send(approvedMessage);
        } catch (error) {
            console.error(error);
        }

        // Invia messaggio di approvazione in pubblico
        let messageUrl = messageReaction.message.url;
        try {
            let newentryMessage = fs.readFileSync("messages/newentry.md", "utf-8");
            newentryMessage = newentryMessage.replace('{{new_member}}', memberReacted.toString())
                .replace('{{presentation_url}}', messageUrl)
                .replace('{{user_id}}', memberReacted.user.id);
            let channel = await guild.channels.fetch(this.configManager.getMainChannelId());
            if (channel && channel.isTextBased()) {
                await channel.send(newentryMessage);
            }
        } catch (error) {
            console.error(error);
        }

        // Salva il nuovo membro nel database
        const response = await axios.post('http://sakuragarden.it/api/users', {
            'discord_id': memberReacted.id,
            'name': memberReacted.displayName,
            'introduction_url': messageUrl,
        });
        console.log(response);
    }

}