const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.DISCORD_TOKEN);

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('message', message => {
	var response=new Response(message);
	response.whatServer(message.channel.guild.id);
	
	if (response.hasCommandTrigger())
		response.toCommand();
});

//#################

function Response(message)
{
	var response=this;
	response.originalMessage=message.content;
	response.originalAuthor=message.author;
	response.videoChannel='';
	
	response.postMessage=function(messageToPost) { message.channel.send(messageToPost); }
	response.postMessageToChannel=function(messageToPost, channelToPost) { bot.channels.get(channelToPost).send(messageToPost); }
	
	//{
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
	//}
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
				.then(response.postMessageToChannel(linkToVid + " "+response.originalAuthor, response.videoChannel))
				.catch(console.error);
		}
	}
	response.toHelp=function()
	{
		response.postMessage("```List of commands:\n\n"+
							"- /vid <link> - posts a video to the video channel```");
	}
	response.toTesting=function()
	{
		response.postMessage(message.channel.guild.id);
	}
	
	//{
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
	//}
	
	response.whatServer=function(serverID)
	{
		switch(serverID)
		{
			case '263045520358899714':
				return response.videoChannel='310035724328239105';
			case '234740225782317057':
				return response.videoChannel='310735697260707841';
			default: return null;
		}
	}
	response.listOfCommands=function(keyword)
	{
		switch(keyword)
		{
			case 'h':
			case 'help':
				return response.toHelp();
			case 'test':
				return response.toTesting();
			case 'vid':
				return response.toVideoLink();
			default: return null;
		}
	}	
}