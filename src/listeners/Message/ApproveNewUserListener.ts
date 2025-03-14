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
        if (messageReaction.emoji.name !== '✅') {
            return;
        }

        let guild = await this.configManager.getGuild();
        let memberReact = await guild.members.fetch(user.id);
        let roles = memberReact.roles.valueOf().map(role => role.id);

        if (!roles.includes(this.configManager.getAdminRoleId())) {
            return;
        }

        let message = messageReaction.message;
        let memberReacted = message.member;
        if (!memberReacted) {
            return;
        }

        await memberReacted.roles.add(this.configManager.getMemberRoleId());
        await memberReacted.roles.remove(this.configManager.getGuestRoleId());

        let messageUrl = message.url;

        // TODO:: Inviare messaggio privato e link d'invito whatsapp
    }

}