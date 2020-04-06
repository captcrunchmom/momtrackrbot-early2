/* Config */
const Discord = require('discord.js'), request = require('request'), https = require('https');
const token = 'NjQ5NjU4NDUzNzY1MTI4MjEz.XoX6PA.Po1rTE6Cd4NzsM6nmAppFBnJb3k';
const client  = new Discord.Client({autoReconnect:true});
client.on('ready', () => { console.log('Bot is connected.'); }).login(token);

client.on('error', err => {
    console.error("Error: " + err + "\n");
});

client.on('message', (msg) => {
    
    var jsonObject, type, queryString, queryUrl, searchUrl, contents;
    
    if (msg.author.bot) { 
        return;
    }

    contents = msg.content.trim().split(" ");
    type = '', queryString = '', queryUrl = '', searchUrl = '';
    
    /* Trigger */
    var trigger = contents[0].toLowerCase();
    if (trigger === "!momtrackr" || trigger === "!mt" ||  trigger === "!search") {

        /* Check for type */ 
        for (i = 0; i<contents.length; i++) {
            if (contents[i].includes('type:')) {
                type = contents[i].split(':')[1];
                contents.splice(i, 1);
            }
        }
        if (type === 'concentrates') { type = 'concentrate'; }

        /* Get search query */
        for (i = 1; i < contents.length; i++) { queryString += contents[i]+' '; }
        queryUrl = 'https://www.momtrackr.com/api/run.php?s='+queryString.substring(0, queryString.length - 1).split(' ').join('+');
        searchUrl = 'https://www.momtrackr.com/go.php?s='+queryString.substring(0, queryString.length - 1).split(' ').join('+');
        if (type) {
            queryUrl += '&t='+type;
            searchUrl += '&t='+type;
        }

        /* API call */
        request(queryUrl, function (error, response, body) {

            /* If API call is successful... */
            if (!error && response.statusCode == 200) {
                var imageString = [" "];

                /* Download JSON data */
                request('https://momtrackr.com/api/run.json', function (error, response, body) {
                    if (!error && response.statusCode == 200) {

                        jsonObject = JSON.parse(body);
                        let embedsay = new Discord.RichEmbed()

                        // If there are 0 results:
                        if (isEmptyObject(jsonObject)) {
                            embedsay.setTitle('No Results Found').setURL(searchUrl)
                                .setFooter('Powered by MOMTrackr.com', imageString[0]);
                        } 

                        // If there are > 0 results:
                        else {
                            embedsay.setTitle('MOMTrackr.com - See All Results')
                                .setURL(searchUrl).setColor('0x337ab7')
                                .setFooter('Powered by MOMTrackr.com — Click \'See All Results\' for more', imageString[0]);
                            var count = 0;
                            jsonObject.forEach(function(result) { 
                                embedsay.addField(result.product.replace("&#8211;", "").trim() + ' - ' + result.mom, result.producturl, false);
                                imageString[count] = result.imageurl;
                                count++;
                            });
                            embedsay.setImage(imageString[0]);
                        }
                        client.channels.find(x => x.name === 'momtrackr').send({ embed: embedsay });
                    }
                });
            }
        });
    }
});

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
