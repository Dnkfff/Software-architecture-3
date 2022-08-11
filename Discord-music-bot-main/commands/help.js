'use strict';

module.exports = {
  name: 'help',
  description: 'Help command',
  execute(message) {
    message.channel.send('To play music write: #play (track name)');
  },
};
