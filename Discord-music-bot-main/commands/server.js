'use strict';

module.exports = {
  name: 'server',
  description: 'information about server',
  execute(message) {
    message.channel.send(`This server's name is ${message.guild.name}`);
  },
};
