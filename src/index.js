let auth = require("./auth.json");
const {Client, GatewayIntentBits} = require("discord.js");
const fs = require('fs');
const jsonfile = require('jsonfile')

let bot = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
let configFileName = 'forbidden-words.json';

function CreateForbiddenWordsFileIfNotExists() {
    fs.stat(configFileName, function (err, stat) {
        if (err == null) {
            console.log(`${configFileName} exists`);
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
    CreateForbiddenWordsFileIfNotExists();
    console.log("I'm ready!")
});

function GetOrCreateServerIndex(obj, serverId) {
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].hasOwnProperty("ServerId") && obj[i].ServerId === serverId) {
            return i;
        }
    }

    return AddNewServerToConfig(obj, serverId);
}

function AddNewServerToConfig(obj, serverId) {
    obj.push({"ServerId": serverId, "ForbiddenWords": []})
    return obj.length - 1;
}

function AddForbiddenWord(obj, forbiddenWordToAdd, serverId) {
    let indexOfServer = GetOrCreateServerIndex(obj, serverId);

    //TODO check if word already exists before adding
    obj[indexOfServer].ForbiddenWords.push(forbiddenWordToAdd);
}

async function GetForbiddenWords(serverId) {
    let result;
    await jsonfile.readFile(configFileName)
        .then(obj => {
            let indexOfServer = GetOrCreateServerIndex(obj, serverId);
            result = obj[indexOfServer].ForbiddenWords;
        })
        .catch(error => {
            console.error(error)
        })
    return result;
}

bot.on("messageCreate", async function (message) {
    console.log(message.content);

    let serverId = message.guildId;

    //TODO add check to ensure person doing command is an admin
    if (message.content.charAt(0) === '!') {
        let messageWords = message.content.slice(1).split(' ');

        if (messageWords[0].toLowerCase() === "add-forbidden-word") {
            console.log("adding bad word")

            let forbiddenWordToAdd = messageWords[1];

            jsonfile.readFile(configFileName)
                .then(obj => {
                    AddForbiddenWord(obj, forbiddenWordToAdd, serverId);

                    jsonfile.writeFile(configFileName, obj);
                })
                .catch(error => console.error(error))
        }
    }

    //TODO split message content on ' ' (space), and remove message if one of the words is a forbidden word based on server id
    else {
        //don't try to filter messages sent by a bot
        if (message.author.bot)
            return;

        let messageWords = message.content.split(' ');
        let forbiddenWords = await GetForbiddenWords(serverId);

        for (let i = 0; i < messageWords.length; i++) {
            if (forbiddenWords.includes(messageWords[i])) {
                message.delete().then(msg => bot.channels.cache.get(msg.channelId).send(`<@${msg.author.id}> YOU SAID A NAUGHTY!!`));
            }
        }
    }

    //TODO add command to remove forbidden word from list based on server id
});

bot
    .login(auth.token)
    .then(() => console.log("logged in!"))
    .catch((er) => console.log(er));
