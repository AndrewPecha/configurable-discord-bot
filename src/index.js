let auth = require("./auth.json");
const { Intents, Client } = require("discord.js");

let bot = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
});

bot.on("ready", function () {
    console.log("Connected");
    console.log("Logged in as: ");
    console.log(bot.user.username + " - (" + bot.user.id + ")");
});

bot.on("messageCreate", function (message) {
    console.log(message);
});

bot
    .login(auth.token)
    .then(() => console.log("logged in!"))
    .catch((er) => console.log(er));
