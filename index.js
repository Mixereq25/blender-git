const Discord = require("discord.js");
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_INVITES]});
const prefix = process.env.PREFIX;
const token = process.env.BOT_TOKEN;

const { Player } = require("discord-music-player");
const player = new Player(client);
// You can define the Player as *client.player* to easily access it.
client.player = player;


client.on("ready", () => {
    console.log("jestem gotowy :D");
    client.user.setActivity({ type: "PLAYING", name: "użyj komendy .pomoc" })
});

client.login(token);


const { RepeatMode } = require('discord-music-player');

client.on("messageDelete", (messageDelete) => {
        //messageDelete.channel.send(`Wiadomość: "${messageDelete.content}" została usunięta ${messageDelete.author.tag} przez ${messageDelete.author.tag}.`)
    });

client.on('messageCreate', async (message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if(message.content.slice(prefix.length)=="ping")
    {
        message.channel.send("Pong");
    }

    if(message.content.slice(prefix.length)=="avatar")
    {
        message.channel.send(message.author.avatarURL());
    }

    if(message.content.slice(prefix.length)=="pomoc")
    {
        message.channel.send("jak moge Ci pomóc? oto lista komend które obsługuje: .ping, .avatar, .play");
    }

    if(message.content.slice(prefix.length)=="puść ekipe")
    {
        message.channel.send("chyba cie fiut swedzi złamasie");
    }

    if(message.content.slice(prefix.length)=="kiedy kajtek zarucha?")
    {
        message.channel.send("szanse na to ze puszcze 2gi raz ekipe sa wieksze od tego ze kajtek kiedys zarucha");
    }


    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);

    if(command === 'play') {
        if(message.content.slice(prefix.length)=="play https://open.spotify.com/track/7rvgrmZdQeR1qDdzLLbo4Q?si=c2ccb5de425847e1")
    {
        message.channel.send("spróbuj jeszcze raz włączyć ekipe to ci wyjebie kurwa");
    }

        //message.channel.send("musisz być na kanale głosowym żeby używać tej komendy");
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel)
        let song = await queue.play(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'playlist') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }

    if(command === 'skip') {
        guildQueue.skip();
    }

    if(command === 'stop') {
        guildQueue.stop();
    }

    if(command === 'removeLoop') {
        guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
    }

    if(command === 'toggleLoop') {
        guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
    }

    if(command === 'toggleQueueLoop') {
        guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
    }

    if(command === 'setVolume') {
        guildQueue.setVolume(parseInt(args[0]));
    }

    if(command === 'seek') {
        guildQueue.seek(parseInt(args[0]) * 1000);
    }

    if(command === 'clearQueue') {
        guildQueue.clearQueue();
    }

    if(command === 'shuffle') {
        guildQueue.shuffle();
    }

    if(command === 'getQueue') {
        console.log(guildQueue);
    }

    if(command === 'getVolume') {
        console.log(guildQueue.volume)
    }

    if(command === 'nowPlaying') {
        console.log(`Now playing: ${guildQueue.nowPlaying}`);
    }

    if(command === 'pause') {
        guildQueue.setPaused(true);
    }

    if(command === 'resume') {
        guildQueue.setPaused(false);
    }

    if(command === 'remove') {
        guildQueue.remove(parseInt(args[0]));
    }

    if(command === 'createProgressBar') {
        const ProgressBar = guildQueue.createProgressBar();
        
        // [======>              ][00:35/2:20]
        console.log(ProgressBar.prettier);
    }
})
Events:
// Init the event listener only once (at the top of your code).
client.player
    // Emitted when channel was empty.
    .on('channelEmpty',  (queue) =>
        console.log(`Everyone left the Voice Channel, queue ended.`))
    // Emitted when a song was added to the queue.
    .on('songAdd',  (queue, song) =>
        console.log(`Song ${song} was added to the queue.`))
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd',  (queue, playlist) =>
        console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
    // Emitted when there was no more music to play.
    .on('queueDestroyed',  (queue) =>
        console.log(`The queue was destroyed.`))
    // Emitted when the queue was destroyed (either by ending or stopping).    
    .on('queueEnd',  (queue) =>
        console.log(`The queue has ended.`))
    // Emitted when a song changed.
    .on('songChanged', (queue, newSong, oldSong) =>
        console.log(`${newSong} is now playing.`))
    // Emitted when a first song in the queue started playing.
    .on('songFirst',  (queue, song) =>
        console.log(`Started playing ${song}.`))
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        console.log(`I was kicked from the Voice Channel, queue ended.`))
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) =>
        console.log(`I got undefeanded.`))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        console.log(`Error: ${error} in ${queue.guild.name}`);
    });
