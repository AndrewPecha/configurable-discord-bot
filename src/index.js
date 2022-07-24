let auth = require("./auth.json");
const {Client, GatewayIntentBits} = require("discord.js");
const fs = require('fs');


let bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});


function CreateBadWordsFileIfNotExists() {
    let configFileName = 'bad-words.json';

    fs.stat(configFileName, function (err, stat) {
        if (err == null) {
            console.log('bad word file exists');
        } else if (err.code === 'ENOENT') {
            // file does not exist
            fs.writeFile(configFileName, "{}", function () {
            });
        } else {
            console.log('Some other error: ', err.code);
        }
    });
}

bot.on("ready", function () {
    console.log("Connected");
    console.log("Logged in as: ");
    console.log(bot.user.username + " - (" + bot.user.id + ")");
    CreateBadWordsFileIfNotExists();
    console.log("I'm ready!")
});

bot.on("messageCreate", function (message) {
    console.log(message.content);
    if(message.content.charAt(0) === '!'){
        //this if needs to check the first 3 words after exclamation are "add forbidden word"
        if(message.content.slice(1).toLowerCase() === "add forbidden word") {
            console.log("adding bad word")
            //get bad words from config file based on server id
            //add to server bad words if not exists already
        }
    }
});

bot
    .login(auth.token)
    .then(() => console.log("logged in!"))
    .catch((er) => console.log(er));
