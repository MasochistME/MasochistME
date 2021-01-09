import Discord from "discord.js";

import { ICommand } from "../types/command";
import { CustomCommand } from "./logic";

import {
  status,
  impersonate,
  options,
  updatecache,
} from "./commands/administration";
import { help, hmod, vid, rec } from "./commands/standard";
import { meme, memelist, addmeme, deletememe } from "./commands/meme";
import {
  follow,
  unfollow,
  followers,
  following,
  live,
} from "./commands/follow";
import {
  addbadge,
  editbadge,
  deletebadge,
  badgelist,
  givebadge,
  takebadge,
} from "./commands/badges";
import { showmembers } from "./commands/members";

export const Command: {
  [key: string]: (command: ICommand, msg: Discord.Message) => string | void;
} = {
  help: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(help, msg),
  hmod: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(hmod, msg),
  meme: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(meme, msg),
  memelist: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(memelist, msg),
  addmeme: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(addmeme, msg),
  deletememe: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(deletememe, msg),
  status: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(status, msg),
  impersonate: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(impersonate, msg),
  vid: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(vid, msg),
  rec: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(rec, msg),
  follow: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(follow, msg),
  unfollow: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(unfollow, msg),
  followers: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(followers, msg),
  following: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(following, msg),
  options: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(options, msg),
  live: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(live, msg),
  updatecache: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(updatecache),
  addbadge: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(addbadge, msg),
  editbadge: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(editbadge, msg),
  deletebadge: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(deletebadge, msg),
  badgelist: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(badgelist, msg),
  givebadge: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(givebadge, msg),
  takebadge: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(takebadge, msg),
  showmembers: (command: ICommand, msg: Discord.Message) =>
    new CustomCommand(command, msg).execute(showmembers, msg),
};
