import Discord from "discord.js";
import { IEmbedField } from "types/command";
import { cache } from "utils/cache";

export const getCommandSymbol = (): string =>
  cache["options"].find(option => option.option === "commandSymbol").value;

export const getKeyword = (msg: Discord.Message): string => {
  const argumentsPresent = msg.content.includes(" ");
  const keyword = argumentsPresent
    ? msg.content.substring(1, msg.content.indexOf(" "))
    : msg.content.substring(1);
  return keyword.toLowerCase();
};

export const removeKeyword = (msg: Discord.Message): string => {
  if (msg.content.indexOf(" ") !== -1) {
    return msg.content.substring(msg.content.indexOf(" ")).trim();
  }
  return "";
};

export const hasSeparator = (msg: Discord.Message): boolean =>
  removeKeyword(msg).includes("|");

export const extractArguments = (msg: Discord.Message): any[] => {
  const args = removeKeyword(msg).trim().split(" ");
  if (args.length === 1 && args[0] === "") {
    return [];
  }
  return args;
};

export const splitByFirstSymbol = (
  msg: Discord.Message,
  symbol: string,
): any[] => {
  const msgContent = removeKeyword(msg);
  const args: any[] = [];
  if (msgContent.indexOf(symbol) === -1) {
    return [msgContent];
  }
  args[0] = msgContent.substring(0, msgContent.indexOf(symbol)).trim();
  args[1] = msgContent.substring(msgContent.indexOf(symbol)).trim();
  return args;
};

export const createEmbed = (
  title: string,
  fields: Array<IEmbedField>,
  color?: string,
  thumbnail?: string,
  footer?: string,
): Discord.MessageEmbed => {
  const embed = thumbnail
    ? new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color ? `0x${color}` : "0xFDC000")
        .setThumbnail(thumbnail)
        .setFooter(footer ? footer : "")
    : new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color ? `0x${color}` : "0xFDC000")
        .setFooter(footer ? footer : "");
  fields.map(field =>
    embed.addField(
      field.title,
      field.content,
      field.inline ? field.inline : false,
    ),
  );
  return embed;
};

export const isLink = (supposedLink: string): boolean =>
  supposedLink.startsWith("http");
