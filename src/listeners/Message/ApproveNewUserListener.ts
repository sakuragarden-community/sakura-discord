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

        let guild: Guild = await this.configManager.getGuild();
        let member: GuildMember = await guild.members.fetch(user.id);
        let roles = member.roles.valueOf().map(role => role.id);

        if (!roles.includes(this.configManager.getAdminRoleId())) {
            return;
        }

        await member.roles.add(this.configManager.getMemberRoleId());
        await member.roles.remove(this.configManager.getGuestRoleId());

        // TODO:: Inviare messaggio privato e link d'invito whatsapp
    }

}