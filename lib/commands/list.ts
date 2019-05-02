import Discord from 'discord.js';

import { ICommand } from '../types/command';
import { 
    EmbedCommand,
    CustomCommand,
} from './logic';

import { status, impersonate, options } from './commands/administration';
import { help, hmod, vid, rec } from './commands/standard';
import { meme, addmeme } from './commands/meme';
import { follow, unfollow, followers, following } from './commands/follow';

export const Command: { [key:string]: (command:ICommand, msg:Discord.Message) => string | void} = {
    help: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(help, msg),
    hmod: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(hmod, msg),
    meme: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(meme, msg),
    addmeme: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(addmeme, msg),
    status: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(status, msg),
    impersonate: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(impersonate),
    vid: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(vid, msg),
    rec: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(rec, msg),
    follow: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(follow, msg),
    unfollow: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(unfollow, msg),
    followers: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(followers, msg),
    following: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(following, msg),
    options: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(options, msg),
};