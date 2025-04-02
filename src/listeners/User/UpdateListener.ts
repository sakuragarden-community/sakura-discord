import "reflect-metadata"
import { autoInjectable } from "tsyringe";
import { Listener } from '@sapphire/framework';
import {DMChannel, GuildMember, Message, User} from "discord.js";

@autoInjectable()
export class UpdateListener extends Listener {

    public constructor(
        context: Listener.LoaderContext,
        options: Listener.Options,
    ) {
        super(context, {
            ...options,
            event: 'guildMemberUpdate'
        });
    }

    public override async run(oldMember: GuildMember, newMember: GuildMember) {
        // TODO:: Secondo rilascio
    }

}