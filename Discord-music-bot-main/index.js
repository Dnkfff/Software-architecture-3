'use strict';

const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT;
//const { prefix, token:TOKEN } = require('./config.json');

const client = new Client({ disableMentions: 'everyone' });
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

client.login(token);
client.commands = new Collection();
client.prefix = process.env.PREFIX;
client.queue = new Map();


// Client Events
client.on('ready', () => {
  console.log(`${client.user.username} ready!`);
  client.user
    .setActivity(`${prefix}help and ${prefix}play`, { type: 'LISTENING' });
});
client.on('warn', info => console.log(info));
client.on('error', console.error);


//Import all commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'))
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', `${file}`));
  client.commands.set(command.name, command);
}

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(cmd => {
      cmd.aliases && cmd.aliases.includes(commandName);
    });

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command.')
      .catch(console.error);
  }
});

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('I am medical-help-bot');
}).listen(PORT);
