'use strict';

//const ytdl = require('erit-ytdl');

const Innertube =  require('youtubei.js');
//const youtube = await new Innertube({ gl: 'US' });

const STAY_TIME = 100;

module.exports = {
  async play(song, message) {

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      setTimeout(() => {
        if (queue.connection.dispatcher && message.guild.me.voice.channel) {
          return;
        }
        queue.channel.leave();
        queue.textChannel.send('Leaving voice channel...');
      }, STAY_TIME * 1000);
      queue.textChannel.send('❌ Music queue ended.').catch(console.error);
      return message.client.queue.delete(message.guild.id);
    }


    let stream = null;
    const streamType = song.url.includes('youtube.com') ? 'opus' : 'ogg/opus';

    try {
      if (song.url.includes('youtube.com')) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel
        .send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on('disconnect', () => {
      message.client.queue.delete(message.guild.id);
    });

    let playingMessage;
    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on('finish', () => {

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          const lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on('error', err => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
      playingMessage = await queue.textChannel
        .send(`🎶 Started playing: **${song.title}** ${song.url}`);
      await playingMessage.react('⏭');
      await playingMessage.react('⏯');
      await playingMessage.react('🔇');
      await playingMessage.react('🔉');
      await playingMessage.react('🔊');
      await playingMessage.react('🔁');
      await playingMessage.react('⏹');
    } catch (error) {
      console.error(error);
    }
    const filter = (reaction, user) => user.id !== message.client.user.id;
    const collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on('collect', (reaction, user) => {
      if (!queue) return;

      switch (reaction.emoji.name) {
      case '⏭':
        queue.playing = true;
        reaction.users.remove(user).catch(console.error);
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${user} ⏩ skipped the song`)
          .catch(console.error);
        collector.stop();
        break;

      case '⏯':
        reaction.users.remove(user).catch(console.error);
        if (queue.playing) {
          queue.playing = !queue.playing;
          queue.connection.dispatcher.pause(true);
          queue.textChannel.send(`${user} ⏸ paused the music.`)
            .catch(console.error);
        } else {
          queue.playing = !queue.playing;
          queue.connection.dispatcher.resume();
          queue.textChannel.send(`${user} ▶ resumed the music!`)
            .catch(console.error);
        }
        break;

      case '🔇':
        reaction.users.remove(user).catch(console.error);
        if (queue.volume <= 0) {
          queue.volume = 100;
          queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
          queue.textChannel.send(`${user} 🔊 unmuted the music!`)
            .catch(console.error);
        } else {
          queue.volume = 0;
          queue.connection.dispatcher.setVolumeLogarithmic(0);
          queue.textChannel.send(`${user} 🔇 muted the music!`)
            .catch(console.error);
        }
        break;

      case '🔉':
        reaction.users.remove(user).catch(console.error);
        if (queue.volume - 10 <= 0) queue.volume = 0;
        else queue.volume -= 10;
        queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
        queue.textChannel
          .send(`${user} 🔉 decreased the volume, 
            the volume is now ${queue.volume}%`)
          .catch(console.error);
        break;

      case '🔊':
        reaction.users.remove(user).catch(console.error);
        if (queue.volume + 10 >= 100) queue.volume = 100;
        else queue.volume += 10;
        queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
        queue.textChannel
          .send(`${user}🔊increased the volume,
             the volume is now ${queue.volume}%`)
          .catch(console.error);
        break;

      case '🔁':
        reaction.users.remove(user).catch(console.error);
        queue.loop = !queue.loop;
        queue.textChannel.send(`Loop is now 
          ${queue.loop ? '**on**' : '**off**'}`)
          .catch(console.error);
        break;

      case '⏹':
        reaction.users.remove(user).catch(console.error);
        queue.songs = [];
        queue.textChannel.send(`${user} ⏹ stopped the music!`)
          .catch(console.error);
        try {
          queue.connection.dispatcher.end();
        } catch (error) {
          console.error(error);
          queue.connection.disconnect();
        }
        collector.stop();
        break;

      default:
        reaction.users.remove(user).catch(console.error);
        break;
      }
    });

    collector.on('end', playingMessage => {
      if (playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
