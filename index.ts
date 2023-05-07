/**
 *
 * This code has been produced by CDX [https://www.fiverr.com/cdxgraphic].
 * The code has been commented so it can be easily understood and edited.
 *
 */

// Import Libraries

import * as Discord from "discord.js";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv"
dotenv.config();

// Load environment variables to memory

const token: string | undefined = process.env.TOKEN;
const appId: string | undefined = process.env.APP_ID;
const guildId: string | undefined = process.env.GUILD_ID;

// Console Functions

/**
 * Logs an informational piece of text to the console using appropriate color formatting.
 * 
 * @param text The base string to print to the console.
 */
export const info = (text: string) => console.log(`${chalk.greenBright("[INFO: " + new Date().toLocaleTimeString() + "] " + text)}`);

/**
 * Logs a warning to the console using appropriate color formatting.
 * 
 * @param text The base string to print to the console.
 */
export const warn = (text: string) => console.log(`${chalk.yellowBright("[WARN: " + new Date().toLocaleTimeString() + "] " + text)}`);

/**
 * Logs an error to the console using appropriate color formatting.
 * 
 * @param text The base string to print to the console.
 */
export const error = (text: string) => console.log(`${chalk.redBright("[ERROR: " + new Date().toLocaleTimeString() + "] " + text)}`);

// Verify .env variables

if (!token) {
	error("Invalid token provided, please read manual.");
	process.exit();
}

if (!appId || !guildId) {
	error("Invalid client Id or guild Id provided, please read manual.");
	process.exit();
}

// Load JSON configuration(s)

const mainConfig = require("./config/main.json");

// Command Handling (slightly modified from https://discordjs.guide's command handler)

// Define base variables

export const commands: Discord.Collection<string, any> = new Discord.Collection();
const commandsJSON: Array<object> = [];

const commandsDir = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".ts"));

// Iterate through each file of the /commands directory

for (const f of commandsFiles) {

	// Variables

	const fileDir = path.join(commandsDir, f);
	const command = require(fileDir);

	// Continue to next file if not enabled

	if("enabled" in command) {
		if (command.enabled != true) {
			warn(`Skipped loading command at: ${fileDir}, because it is disabled.`);
		}
	}

	// Verify "data" and "execute" fields are present

	if ("data" in command && "execute" in command) {
		// Add command to command collection and JSON array

		commands.set(command.data.name, command);
		commandsJSON.push(command.data.toJSON());
	} else {
		error(`Failed to load command at ${fileDir}, please contact developer.`);
	}

}

// Client Initialization

// Define Client

const client: Discord.Client = new Discord.Client({
	intents: [Discord.IntentsBitField.Flags.Guilds],
});

// Event Handling (slightly modified from https://discordjs.guide's event handler)

// Define base variables

const eventsDir = path.join(__dirname, "events");
const eventsFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith(".ts"));

// Iterate through each file of the /events directory

for (const f of eventsFiles) {

	// Variables

	const filePath = path.join(eventsDir, f);
	const event = require(filePath);

	// Attach listener

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else client.on(event.name, (...args) => event.execute(...args));

}

// Listen to "ready" event

client.once(Discord.Events.ClientReady, async (c: Discord.Client) => {

	// Ensure bot has logged in correctly

	if (c.user && client.user) info(`Initialized Discord Bot, Logged in as ${c.user.tag}`);
	else {
		error("An error occurred whilst initializing the Discord Bot. Please contact developer with this error.¹");
		process.exit();
	}

	if (c.user.id != client.user.id) {
		error("An error occurred whilst initializing the Discord Bot. Please contact developer with this error.²");
		process.exit();
	}

	// Deployment of Slash Commands

	// Initialize REST client

	const rest = new Discord.REST().setToken(token);

	if (guildId?.toLowerCase() == "none") { // Application (/) commands

		info(`Started deploying ${commands.size} application (/) commands!`);

		const data: any = await rest.put(
			Discord.Routes.applicationCommands(appId),
			{ body: commandsJSON }
		)

		info(`Successfully deployed ${data.length} application (/) commands!`);

	} else { // Guilds (/) commands

		info(`Started deploying ${commands.size} guild (/) commands!`);

		const data: any = await rest.put(
			Discord.Routes.applicationGuildCommands(appId, guildId),
			{ body: commandsJSON }
		);

		info(`Successfully deployed ${data.length} guild (/) commands!`);

	}

	// Activity

	// Check if "activity" field is present in configuration

	if (mainConfig.activity) {

		// Ensure activity is enabled and fields are valid

		if (typeof mainConfig.activity == "string") return warn("Disabled Bot Activity");
		if (!mainConfig.activity.type || !mainConfig.activity.text) return;
		if ((mainConfig.activity.type as string).toLowerCase() !== "playing" && (mainConfig.activity.type as string).toLowerCase() !== "watching" && (mainConfig.activity.type as string).toLowerCase() !== "listening" && (mainConfig.activity.type as string).toLowerCase() !== "competing") return error("Failed to set activity due to invalid activity type provided in config. Please read manual.");
		
		// Set Activtiy

		c.user.setActivity(mainConfig.activity.text, {
			name: mainConfig.activity.type
		});
		let editedType: string = mainConfig.activity.type.toLowerCase();
		if (editedType.toLowerCase() == "listening") editedType = "listening to"
		info(`Set Bot Activity to: ${editedType} ${(mainConfig.activity.text as string).toLowerCase()}`);

	} else return warn("Disabled Bot Activity");
	
})

// 🚀 Blast Off!

client.login(process.env.TOKEN);

// Export

module.exports = { commands, info, warn, error }