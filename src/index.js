let auth = require("./auth.json");
const {Client, GatewayIntentBits} = require("discord.js");
const fs = require('fs');
const jsonfile = require('jsonfile')

let bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
let configFileName = 'bad-words.json';

function CreateBadWordsFileIfNotExists() {
    fs.stat(configFileName, function (err, stat) {
        if (err == null) {
            console.log('bad word file exists');
        } else if (err.code === 'ENOENT') {
            // file does not exist
            fs.writeFile(configFileName, "[]", function () {
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

function GetServerIndex(obj, serverId) {
    for (let i = 0; i < obj.length; i++) {
        if(obj[i].hasOwnProperty("ServerId") && obj[i].ServerId === serverId){
            return i;
        }
    }

    return -1;
}

function AddNewServerToConfig(obj, serverId) {
    obj.push({ "ServerId": serverId, "ForbiddenWords": [] })
    return obj.length - 1;
}

function AddForbiddenWord(obj, forbiddenWordToAdd, indexOfServer) {
    //TODO check if word already exists before adding
    if(obj[indexOfServer].hasOwnProperty("ForbiddenWords")){
        obj[indexOfServer].ForbiddenWords.push(forbiddenWordToAdd);
    }
}

bot.on("messageCreate", function (message) {
    console.log(message.content);

    let serverId = message.guildId;

    if(message.content.charAt(0) === '!'){
        let messageWords = message.content.slice(1).split(' ');

        if(messageWords[0].toLowerCase() === "add-forbidden-word") {
            console.log("adding bad word")

            let forbiddenWordToAdd = messageWords[1];

            jsonfile.readFile(configFileName)
                .then(obj => {

                    let serverWordsIndex = GetServerIndex(obj, serverId);
                    if(serverWordsIndex === -1){
                        serverWordsIndex = AddNewServerToConfig(obj, serverId);
                    }

                    AddForbiddenWord(obj, forbiddenWordToAdd, serverWordsIndex);

                    jsonfile.writeFile(configFileName, obj);
                })
                .catch(error => console.error(error))
        }
    }

    //TODO add else and check for bad words based on server id
    //TODO split message content on ' ' (space), and remove if one of the words is a forbidden word
});

bot
    .login(auth.token)
    .then(() => console.log("logged in!"))
    .catch((er) => console.log(er));
