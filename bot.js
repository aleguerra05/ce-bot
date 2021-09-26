const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
var parserJobs = require('./parseJobs');
var Job = require('./Job');
var request = require('request');
dotenv.config();
const token = process.env.TELEGRAM_BOT_KEY;
const bot = new TelegramBot(token, {polling:true});

bot.on('polling_error', function(error){
    console.log(error);
});

// Grettings
bot.onText(/\bhola\b|\bhi\b|\bhello\b/gmi, (msg) => {
    var chatId = msg.chat.id;
    var msgId = msg.message_id;
    var nameUser = msg.from.first_name;
    
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text:"Jobs",callback_data:"/jobs"},{text:"About the company",callback_data:"/info"}]]
        })
    };

    bot.sendMessage(chatId, `${nameUser}, a pleasure to have you here with us, how can we help you?`,opts);
});

// Welcome and Godbye messages
bot.on('message', function(msg){
    
    var chatId = msg.chat.id;
    var chatitle = msg.chat.title;
    
    if (msg.new_chat_members != undefined){
    
        const opts = {
            reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text:"Jobs",callback_data:"/jobs"},{text:"About the company",callback_data:"/info"}]]
            })
        };

        var nameNewMember = msg.new_chat_member.first_name;
        bot.sendMessage(chatId, `Hello ${nameNewMember}, welcome to our ${chatitle} group`,opts);

    }
    else if (msg.left_chat_member != undefined){
        // if the user leave the group don't send any message for the moment
    }
});

// Find text on a jobs title and return the job
bot.on("text",async (msg)=>{
    var chatId = msg.chat.id;
    var nameUser = msg.from.first_name;

    var jobs = await getJobs();
    var matchingJobs = [];

    jobs.forEach(job => {
        if(msg.text.match(job.expression)){
            matchingJobs.push(job);
        }
    });

    sendJobs(msg,matchingJobs);
});

// Ask for all jobs
bot.onText(/\/jobs/, async function listJobs(msg) {
    let jobs = await getJobs()
    //console.log(jobs);
    sendJobs(msg,jobs);
});

// Send a response with a list of jobs
function sendJobs(msg,jobs){
    var chatId = msg.chat.id;
    var msgId = msg.message_id;

    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            inline_keyboard: []
        })
    };

    var list = [];
    jobs.forEach(job => {
        var line = [];
        line.push({ text: job.title, callback_data: job.title, url: job.url });
        list.push(line);
    });

    opts.reply_markup = JSON.stringify({ inline_keyboard: list });
    bot.sendMessage(msg.chat.id, 'We found some job oportunities...', opts);

}

// Return al jobs
function getJobs(){
    var url = "https://odoo.cuban.engineer/jobs"
    return new Promise(function (resolve,reject){
        request({ uri: url }, async function(error, response, body) {
            if(!error){ 
                var jobsData = await parserJobs.parseResponse(body, url);
                jobsData.splice(jobsData.indexOf({ title: undefined }));
                
                var jobs = [];

                jobsData.forEach(data => {
                    jobs.push(new Job(data.title,data.link));
                });
                resolve(jobs);
    
            }else{
                console.log(error.message);
                reject(error);
            }
        });
    });
}

// Ask for ce info
bot.onText(/\/info/, function info(msg) { 
    var chatId = msg.chat.id;
    var msgId = msg.message_id;
    bot.sendPhoto(chatId,'https://odoo.cuban.engineer/web/image/11696-b3bf2141/92145579_2645038935779359_1740106545435246592_o.jpg',{caption:`<a href="https://cuban.engineer">About cuban.engineer </a> <b>We are a team of passionate people whose goal is to improve everyone's life through disruptive products. We build great products to solve your business problems.</b>`,parse_mode : "HTML",reply_to_message_id: msgId});
});

// Response to the buttons
bot.on('callback_query', async function onCallbackQuery(button){
    const data = button.data;
    const msg = button.message;
    const chatId = button.message.chat.id;

    switch(data){
        case '/jobs':
            var jobs = await getJobs();
            sendJobs(msg,jobs);
            break;
        case '/info':
            bot.sendPhoto(chatId,'https://odoo.cuban.engineer/web/image/11696-b3bf2141/92145579_2645038935779359_1740106545435246592_o.jpg',{caption:`<a href="https://cuban.engineer">About cuban.engineer </a> <b>We are a team of passionate people whose goal is to improve everyone's life through disruptive products. We build great products to solve your business problems.</b>`,parse_mode : "HTML"});
    }
});

// Mock server
const http = require('http');
const { title } = require('process');
const port = 80;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});