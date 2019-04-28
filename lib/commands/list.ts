import Discord from 'discord.js';

import { ICommand } from '../types/command';
import { 
    EmbedCommand,
    CustomCommand,
} from './logic';

import { status, impersonate } from './commands/administration';

export const Command: { [key:string]: (command:ICommand, msg:Discord.Message) => string | void} = {
    status: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(status, msg),
    impersonate: (command:ICommand, msg:Discord.Message) => new CustomCommand(command, msg).execute(impersonate)
};