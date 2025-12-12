import "dotenv/config";
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";

const TOKEN = process.env.DISCORD_TOKEN;         
const CLIENT_ID = process.env.DISCORD_CLIENT_ID; 
const API_URL = "https://2ktrchlv5c.execute-api.us-west-2.amazonaws.com/server";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies with pong!"),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("control minecraft server")
    .addStringOption(option => 
        option.setName("action")
            .setDescription("choose action")
            .setRequired(true)
            .addChoices( {name: "on", value: "on"}, {name: "off", value: "off"})
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerCommands() {
  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );
  console.log("Slash command registered.");
}
registerCommands();


const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("pong!");
  }
  if (interaction.commandName === "server") {
  const action = interaction.options.getString("action");

  await interaction.reply(`⏳ trying to turn **${action}** the server...`);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),   
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("API error:", res.status, data);
      await interaction.followUp(`❌ API error: ${res.status}`);
      return;
    }

    const msg = data?.message ?? "server command sent.";
    await interaction.followUp(`✅ ${msg}`);
  } catch (err) {
    console.error("fetch error:", err);
    await interaction.followUp("❌ failed to call server control API.");
  }
}
});

client.login(TOKEN);
