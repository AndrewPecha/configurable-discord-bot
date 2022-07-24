let auth = require("./auth.json");
const {Client, GatewayIntentBits} = require("discord.js");
const fs = require('fs');


let bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});


bot.on("ready", function () {
    console.log("Connected");
    console.log("Logged in as: ");
    console.log(bot.user.username + " - (" + bot.user.id + ")");
    fs.stat('bad-words.json', function(err, stat) {
        if (err == null) {
            console.log('bad word file exists');
        } else if (err.code === 'ENOENT') {
            // file does not exist
            fs.writeFile('bad-words.json', "{}", function() {});
        } else {
            console.log('Some other error: ', err.code);
        }
    });
});

bot.on("messageCreate", function (message) {
    console.log(message.content);
});

bot
    .login(auth.token)
    .then(() => console.log("logged in!"))
    .catch((er) => console.log(er));
