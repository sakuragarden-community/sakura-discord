import "reflect-metadata"
import { autoInjectable } from "tsyringe";
import { Listener } from '@sapphire/framework';
import { DMChannel, Message, User } from "discord.js";

@autoInjectable()
export class UpdateListener extends Listener {

    public constructor(
        context: Listener.LoaderContext,
        options: Listener.Options,
    ) {
        super(context, {
            ...options,
            event: 'roleUpdate'
        });
    }

    public override async run(message: Message) {
        // ...
    }

}