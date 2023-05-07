import * as Discord from "discord.js";
const { commands, error } = require("../index.ts");

// Listening for interactionCreate event

module.exports = {
    name: Discord.Events.InteractionCreate,
    async execute(i: Discord.Interaction) {
        
        // Command Handler

        if (i.isChatInputCommand()) {

            // Variable(s)

            const command = commands.get(i.commandName);

            // Ensure command is registered in memory

            if (!command) {
                error(`No command file registered for command: /${i.commandName}`);
                return;
            }

            // Attempt to execute

            try {
                await command.execute(i);
            } catch (err) {
                error(`An error occurred whilst executing command: /${i.commandName}`)
                console.log(err);
            }

        } else return;

    }
}