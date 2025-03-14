import "reflect-metadata"
import { autoInjectable } from "tsyringe";
import { Listener } from '@sapphire/framework';
import { DMChannel, Guild, GuildMember, Message, MessageReaction, User} from "discord.js";
import { ConfigManager } from "../../managers/ConfigManager";

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

        let guild = await this.configManager.getGuild();
        let memberReact = await guild.members.fetch(user.id);

        // Verifica che la reaction è stata assegnata da un admin
        let roles = memberReact.roles.valueOf().map(role => role.id);
        if (!roles.includes(this.configManager.getAdminRoleId())) {
            return;
        }

        // Aggiunge il ruolo dei membri e toglie quello degli ospiti
        let memberReacted = messageReaction.message.member;
        if (!memberReacted) {
            return;
        }

        await memberReacted.roles.add(this.configManager.getMemberRoleId());
        await memberReacted.roles.remove(this.configManager.getGuestRoleId());

        // Salva il nuovo membro nel database
        let messageUrl = messageReaction.message.url;

        // TODO:: Inviare messaggio privato e link d'invito whatsapp
    }

}