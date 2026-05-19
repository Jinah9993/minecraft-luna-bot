# 🌙 minecraft-luna-bot

> Discord bot for controlling a Minecraft server hosted on AWS EC2 — built with Node.js and discord.js.

---

## 📖 Overview

A Discord bot that lets you control a Minecraft server through slash commands — start it, stop it, and check its status directly from Discord.

The bot listens to Discord Gateway events via WebSocket and forwards commands to an AWS API Gateway endpoint, which triggers a Lambda function to start or stop the EC2 instance running the Minecraft server.

---

## 🏗️ Architecture

```
Discord User
    │
    │  /server on  /server off
    ▼
Discord Gateway (WebSocket)
    │
    ▼
Node.js Bot (discord.js) ← runs as a persistent process
    │
    ▼
AWS API Gateway
    │
    ▼
Lambda → EC2 start / stop
```

---

## ✨ Commands

| Command | Description |
|---------|-------------|
| `/ping` | Replies with pong (health check) |
| `/server on` | Starts the Minecraft EC2 server |
| `/server off` | Stops the Minecraft EC2 server |

---

## 🛠️ Tech Stack

- **discord.js** — Discord bot framework
- **Node.js** — Runtime
- **AWS API Gateway + Lambda** — Server control backend
- **dotenv** — Environment variable management

---

## 🚀 Setup

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/minecraft-luna-bot.git
cd minecraft-luna-bot
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Fill in `.env`:
```
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

### 3. Run the bot
```bash
node index.js
```

---

## ⚠️ Why I moved away from this approach

This version works, but it has one big problem: **the bot process has to be running 24/7**.

That means you need somewhere to host it constantly — another EC2 instance, a Lightsail server, or leaving your laptop on. For a hobby project that's already paying for an EC2 instance to run the Minecraft server, adding another always-on machine just to keep the bot alive doubles the cost for no real reason.

After running into this, I looked for a better way and landed on **Discord's Interactions endpoint model** — instead of the bot maintaining a persistent WebSocket connection, Discord sends an HTTP POST request directly to an endpoint whenever a slash command is used. That meant I could replace the always-on bot with a **Lambda function that only runs on demand**, at basically zero cost.


---

## 📝 Notes

- This is a **v1 / legacy version** kept for reference
- The Minecraft server runs on AWS EC2 (t3.small)
- API Gateway endpoint and Lambda are still required on the AWS side
