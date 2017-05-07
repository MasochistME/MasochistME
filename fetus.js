const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.DISCORD_TOKEN);

bot.on('ready', () => {
  console.log('I am ready!');
  bot.user.setGame('/h for help');
});

bot.on('message', message => {
	var response=new Response(message);
	response.whatServer(message.channel.guild.id);
	
	if (response.hasCommandTrigger())
		response.toCommand();
	if (response.hasReactionTrigger())
		response.toReactionTrigger();
	if (response.hasStatusChangeTrigger())
		response.toStatusChangeTrigger();
});

bot.on('presenceUpdate', presence => {
	var roles=new Roles(presence);		
	var game=presence.frozenPresence.game;	
	
	if (game && game.url) 
	{	
		console.log(game.url);
		if (!roles.hasStreamingRole())
			roles.setNewRole('streaming');
	}
	if (!game || (game && !game.url))
	{
		if (roles.hasStreamingRole())
			roles.removeRole('streaming');
	}
});

//#################

function Response(message)
{
	var response=this;
	response.originalMessage=message.content;
	response.originalAuthor=message.author;
	response.videoChannel='';
	
	response.editMessage=function(editedContent) { message.edit(editedContent); }
	response.postMessage=function(messageToPost) { message.channel.send(messageToPost); }
	response.postMessageToChannel=function(messageToPost, channelToPost) { bot.channels.get(channelToPost).send(messageToPost); }
	response.reactToMessage=function(reactionEmoji) { message.react(reactionEmoji); }
	response.changeStatus=function(newStatus) { bot.user.setGame(newStatus); }
	
	//{ checks for triggers
	response.hasCommandTrigger=function()
	{
		if (response.originalMessage.startsWith('/'))
			return true;
		return false;
	}
	response.hasStatusChangeTrigger=function()
	{
		if (response.originalMessage.startsWith('#'))
			return true;
		return false;
	}
	response.hasReactionTrigger=function()
	{
		for (var i=0; i<response.arrayOfTriggers.length; i++)
		{
			if (response.originalMessage.indexOf(response.arrayOfTriggers[i][0])!=-1)
				return true;
		}
		return false;
	}
	response.isLink=function(supposedLink)
	{
		if (supposedLink.startsWith('http'))
			return true;
		return false;
	}
	//}
	response.toModCommand=function(modCommand)
	{
		if (response.originalAuthor.id=='205755033210454016') //165962236009906176 is mine
		{
			switch(modCommand)
			{
				case 'fk':
					return response.postMessage('http://i.imgur.com/hpW1uTO.png');
				default: return null;
			}
		}
	}
	response.toStatusChangeTrigger=function()
	{
		var newStatus=response.originalMessage.slice(1);
		response.changeStatus(newStatus);
	}
	response.toReactionTrigger=function()
	{
		for (var i=0; i<response.arrayOfTriggers.length; i++)
		{
			if (response.originalMessage.indexOf(response.arrayOfTriggers[i][0])!=-1)
				return response.reactToMessage(response.arrayOfTriggers[i][1]);
		}
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
		console.log('all right!');
	}
	
	//{ keyword stuff
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
	
	//{ arrays
	response.whatServer=function(serverID)
	{
		switch(serverID)
		{
			case '263045520358899714': //0.1%
				return response.videoChannel='310035724328239105';
			case '234740225782317057': //vikmains
				return response.videoChannel='310735697260707841';
			default: return null;
		}
	}
	response.arrayOfTriggers=[['Ⓜ', ':mm:310140119606886421']];
	response.listOfCommands=function(keyword)
	{
		switch(keyword)
		{
			case 'fk':
				return response.toModCommand('fk');
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
	//}
}

function Roles(presence)
{
	var roles=this;
	roles.user=presence.guild.member(presence.user.id);
	roles.list=presence._roles;
	roles.streamingRole='277466738218762241'; //for arcytesting, '310767157153759243'; //for 0.1%
	
	roles.hasStreamingRole=function()
	{
		for (var i=0; i<roles.list.length; i++)
		{
			if (roles.list[i]==roles.streamingRole)
				return true;
		}
		return false;
	}
	
	roles.setNewRole=function(desiredRole)
	{
		switch(desiredRole)
		{
			case 'streaming':
				return roles.user.addRole(roles.streamingRole);
			default: break;
		}
	}
	roles.removeRole=function(roleToRemove)
	{
		switch(roleToRemove)
		{
			case 'streaming':
				return roles.user.removeRole(roles.streamingRole);
			default: break;
		}
	}
}