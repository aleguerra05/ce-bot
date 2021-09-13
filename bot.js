const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
var parserJobs = require('./parseJobs');
var request = require('request');
dotenv.config();
const token = process.env.TELEGRAM_BOT_KEY;
const bot = new TelegramBot(token, {polling:true});

bot.on('polling_error', function(error){
    console.log(error);
});

// Find text on a jobs title and return the job
bot.on("text",(msg)=>{
    var chatId = msg.chat.id;
    

    var chatId = msg.chat.id;
    var nameUser = msg.from.first_name;

    var url = "https://odoo.cuban.engineer/jobs"

    request({ uri: url }, async function(error, response, body) {
        if(!error){ 
            var jobsData = await parserJobs.parseResponse(body,url);

            jobsData.splice(jobsData.indexOf({title:undefined}));

            jobsData.forEach(job => {
                let words = job.title.split(' ');
                let expression = new RegExp("\\b"+words.join("\\b|\\b")+"\\b",'i');

                if(msg.text.match(expression))
                    bot.sendMessage(chatId, `<b>${nameUser}, we have a job opportunity for</b> <a href=\"${job.link}\">${job.title}</a>`,{parse_mode : "HTML"});
            });
            

        }else{
            console.log(error.message);
            bot.sendMessage(chatId, error.message);
        }
    });
});

// Ask for all jobs
bot.onText(/\/jobs/, function listJobs(msg) {
    
    var chatId = msg.chat.id;
    var msgId = msg.message_id;

    var url = "https://odoo.cuban.engineer/jobs"

    request({ uri: url }, async function(error, response, body) {
        if(!error){ 
            var jobsData = await parserJobs.parseResponse(body,url);

            jobsData.splice(jobsData.indexOf({title:undefined}));

            jobsData.forEach(job => {
                bot.sendMessage(msg.chat.id,`<a href=\"${job.link}\">${job.title}</a>` ,{parse_mode : "HTML",reply_to_message_id: msgId});
            });

        }else{
            console.log(error.message);
            bot.sendMessage(chatId, error.message);
        }
    });
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