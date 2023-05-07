/**
 * 
 * This command is added apart of all packages, you may use, disable or delete it.
 * 
 */

import * as Discord from "discord.js";

module.exports = {
    enabled: true, // You may toggle this on
    data: new Discord.SlashCommandBuilder()
        .setName("help")
        .setDescription("View all of my commands or view further information on a specific command."),
    async execute(i: Discord.ChatInputCommandInteraction) {

        i.reply("Hello!");

    }
}