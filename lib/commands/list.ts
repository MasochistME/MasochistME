import Discord from 'discord.js';

import { ICommand } from '../types/command';
import { 
    EmbedCommand,
    CustomCommand,
} from './logic';

import { 
    status, 
    impersonate,
} from './commands/administration';
import { 
    help,
    hmod,
    meme,
    addmeme,
    vid,
    rec,
} from './commands/standard';

export const Command: { [key:string]: (command:ICommand, msg:Discord.Message) => string | void} = {
    help: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(help, msg),
    hmod: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(hmod, msg),
    meme: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(meme, msg),
    addmeme: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(addmeme, msg),
    status: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(status, msg),
    impersonate: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(impersonate),
    vid: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(vid, msg),
    rec: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(rec, msg),
};