var HTMLParser = require('node-html-parser');
var request = require('request');

module.exports = {
    
    parseResponse: async function(body,url){
        var root = HTMLParser.parse(body);

        var listJobs = root.querySelectorAll('h3');
         
        var finalData = [];

        for (let index = 1; index < listJobs.length; index++) {
            const element = listJobs[index];
            
            try {
                var result = await this.parseJobs(element,url);
                finalData.push(result)
            } catch (error) {
                console.log(error.message);
                continue;                    
            }
        }

        return finalData;
    },

    parseJobs: async function(element,url){
        var data = {
            link : url + element.querySelectorAll('a')[0]?.rawAttributes.href.replace('/jobs',''),
            title : title = element.querySelectorAll('span')[0]?.text
        };

        return data;    
    },
    
    downloadPage: async function (url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) reject(error);
                if (response.statusCode != 200) {
                    reject('Invalid status code <' + response.statusCode + '>');
                }
                resolve(body);
            });
        });
    },
  };