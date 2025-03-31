import "reflect-metadata"
import { autoInjectable } from "tsyringe";
import { Listener } from '@sapphire/framework';
import {DMChannel, GuildMember, Message, User} from "discord.js";
import * as fs from "fs";

@autoInjectable()
export class AddListener extends Listener {

    public constructor(
        context: Listener.LoaderContext,
        options: Listener.Options,
    ) {
        super(context, {
            ...options,
            event: 'guildMemberAdd'
        });
    }

    public override async run(member: GuildMember) {
        // Invia messaggio di benvenuto
        try {
            let welcomeMessage = fs.readFileSync("messages/welcome.md", "utf-8");
            await member.send(welcomeMessage);
        } catch (error) {
            console.error(error);
        }
    }

}