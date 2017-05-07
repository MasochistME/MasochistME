const Discord = require('discord.js');
const bot = new Discord.Client();

const videoChannel='310035724328239105';

bot.login(DISCORD_TOKEN);

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('message', message => {
	var response=new Response(message);
	
	if (response.hasCommandTrigger())
		response.toCommand();
});

//#################

function Response(message)
{
	var response=this;
	response.originalMessage=message.content;
	
	response.postMessage=function(messageToPost) { message.channel.send(messageToPost); }
	response.postMessageToChannel=function(messageToPost, channelToPost)
	{
		//console.log('I post -'+messageToPost+'- in -'+channelToPost+'- channel.);
		bot.channels.get(channelToPost).send(messageToPost)
	}
	
	response.hasCommandTrigger=function()
	{
		if (response.originalMessage.startsWith('/'))
			return true;
		return false;
	}
	response.isLink=function(supposedLink)
	{
		if (supposedLink.startsWith('http'))
			return true;
		return false;
	}
	response.toCommand=function()
	{
		response.listOfCommands(response.extractKeyword());
	}
	response.toVideoLink=function()
	{
		var linkToVid=response.removeKeyword();
		if (response.isLink(linkToVid))
		{
			message.delete(3000)
				.then(response.postMessageToChannel(linkToVid, videoChannel))
				.catch(console.error);
		}
	}
	response.toHelp=function()
	{
		response.postMessage("```List of commands:\n\n"+
							"- /vid <link> - posts a video to the video channel```");
	}
	
	response.extractKeyword=function()
	{
		var keyword=response.originalMessage;
		keyword=keyword.slice(1).trim();
		if (keyword.indexOf(' ')!=-1)
			keyword=keyword.slice(0,keyword.indexOf(' ')).trim();
		return keyword;
	}
	response.removeKeyword=function()
	{
		var content=response.originalMessage;
		content=content.slice(content.indexOf(' ')).trim();
		return content;
	}
	
	response.listOfCommands=function(keyword)
	{
		switch (keyword)
		{
			case 'vid':
				return response.toVideoLink();
			case 'h':
			case 'help':
				return response.toHelp();
			default: return null;
		}
	}	
}