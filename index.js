// Config
const Discord = require('discord.js');
const client  = new Discord.Client();
const token   = 'NjQ5NjU4NDUzNzY1MTI4MjEz.XeAAAw.Sq0r6zlVi0_U9Dc9S5UJJJzkc70';
const request = require('request');		
const https   = require('https');
var jsonObject;
client.on('ready', () => { console.log('Bot is connected.'); });
client.login(token);

// !momtrackr trigger
client.on('message', (msg) => {

	var contents = msg.content.trim().split(" ");
	var queryString = '';
	var queryUrl    = '';

	if(contents[0] === "!momtrackr"){

		for (i = 1; i < contents.length; i++) { queryString += contents[i]+' '; }
		queryString = queryString.substring(0, queryString.length - 1);
		queryUrl = 'https://www.momtrackr.com/api/run.php?s='+queryString.split(' ').join('+');

		console.log('Query: '+queryUrl);

		request(queryUrl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
		    	var resultString = 'Results: \n';
		    	var imageString = '';
				request('https://momtrackr.com/api/run.json', function (error, response, body) {
					if (!error && response.statusCode == 200) {
				    	jsonObject = JSON.parse(body);
				    	console.log(jsonObject);
						let embedsay = new Discord.RichEmbed()
							.setTitle('MOMTrackr.com - Results')
						    .setColor('0x337ab7')
						    .setURL('https://momtrackr.com')
							.setThumbnail(imageString)
							.setImage(imageString)
							.setFooter('Powered by MOMTrackr.com', imageString);

						jsonObject.forEach(function(result) { 
							embedsay.addField(result.product + ' - ' + result.mom, result.producturl, false);
							imageString = result.imageurl;
							resultString += result.producturl+'\n';
						});

						client.channels.find(x => x.name === 'momtrackr').send({ embed: embedsay });
					}
				});
			}
		});
	}

	if(contents[0] === "!momtrackr-test"){

		// Test stuff
	}
});