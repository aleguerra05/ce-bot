const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TELEGRAM_BOT_KEY;
const bot = new TelegramBot(token, {polling:true});

bot.on('polling_error', function(error){
    console.log(error);
});

bot.on("text",(msg)=>{
    var chatId = msg.chat.id;
    bot.sendMessage(chatId,`Received: ${msg.text}`);
});