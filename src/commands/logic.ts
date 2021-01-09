import Discord from "discord.js";
import {
  ICommand,
  IExecuteText,
  IExecuteCustom,
  IExecuteEmbed,
  IEmbedField,
} from "../types/command";
import { botRefuses } from "utils/rng";
import { createEmbed } from "utils/helpers";
import { isUserAdmin } from "message";

class Command {
  public channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;
  public canBeExecuted: boolean;
  private isDisabled: boolean;
  private isModOnly: boolean;
  private isProtected: boolean;
  private refusal: string;

  constructor(command: ICommand, msg: Discord.Message) {
    this.channel = msg.channel;
    this.isDisabled = command.isDisabled || false;
    this.isModOnly = command.isModOnly || false;
    this.isProtected = command.isProtected || true;
    this.refusal = command.refusal || "Your commands tire me.";
    this.canBeExecuted = this._canBeExecuted(msg);
  }

  private _canBeExecuted(msg: Discord.Message) {
    if (this.isDisabled) {
      msg.react("🚧");
      return false;
    }
    if (this.isModOnly && !isUserAdmin(msg)) {
      msg.react("🚫");
      return false;
    }
    if (botRefuses()) {
      this.channel.send(this.refusal);
      return false;
    }
    return true;
  }
}

class Reaction {
  public channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;

  constructor(msg: Discord.Message) {
    this.channel = msg.channel;
  }
}

export class TextCommand extends Command implements IExecuteText {
  public execute(content: string): void {
    this.canBeExecuted && this.channel.send(content);
  }
}
export class EmbedCommand extends Command implements IExecuteEmbed {
  public execute(title: string, fields: [IEmbedField], color?: string): void {
    const embed = createEmbed(title, fields, color);
    this.canBeExecuted && this.channel.send(embed);
  }
}
export class CustomCommand extends Command implements IExecuteCustom {
  // eslint-disable-next-line @typescript-eslint/ban-types
  public execute(fn: Function, ...args: Array<any>): void {
    this.canBeExecuted && fn(...args);
  }
}

export class TextReaction extends Reaction implements IExecuteText {
  public execute(content: string): void {
    this.channel.send(content);
  }
}
export class CustomReaction extends Reaction implements IExecuteCustom {
  // eslint-disable-next-line @typescript-eslint/ban-types
  public execute(fn: Function, ...args: Array<any>): void {
    fn(...args);
  }
}
