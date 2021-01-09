import Discord from "discord.js";
import { log } from "utils/log";
import { TextCommand } from "commands/logic";
import { Reaction } from "commands/reactions";
import { cache } from "utils/cache";
import { getKeyword, getCommandSymbol } from "utils/helpers";
import { chooseRandom, happensWithAChanceOf } from "utils/rng";
import { badgeCreation } from "commands/commands/badges";
import { Command } from "commands/list";

import { IReactionDetails } from "./types/reaction";

// LOGIC

const isChannelDM = (msg: Discord.Message): boolean =>
  msg.author.id === msg.channel.id;
const isUserAdmin = (msg: Discord.Message): boolean =>
  !!msg.member?.hasPermission("ADMINISTRATOR");
const isUserBot = (msg: Discord.Message) => msg.author.bot;
const isUserArcy = (msg: Discord.Message) =>
  msg.author.id === "165962236009906176";
const messageStartsWithCommandSymbol = (msg: Discord.Message) =>
  msg.content.startsWith(getCommandSymbol());
const isMessageRant = (msg: Discord.Message) =>
  msg.content === msg.content.toUpperCase() && msg.content.length > 20;

const deleteCommand = (msg: Discord.Message) => {
  setTimeout(() => {
    msg
      .delete()
      .then()
      .catch(err => log.WARN(err));
  }, 10000);
};
const answer = (msg: Discord.Message, answer: string) =>
  msg.channel.send(answer);
const answerCommand = (msg: Discord.Message) => {
  const command = commandObject(msg);
  if (command && command.text) {
    new TextCommand(command, msg).execute(command.text);
    deleteCommand(msg);
    return;
  }
  if (command && Command[getKeyword(msg)]) {
    Command[getKeyword(msg)](command, msg);
    deleteCommand(msg);
    return;
  }
  msg.react("❔");
};
const checkForReactionTriggers = (msg: Discord.Message) => {
  const appropiateReactions: any[] = [];

  if (msg.author.id === "431975056919363594") {
    appropiateReactions.push(
      ...cache["reactions"]?.filter((reaction: any) => reaction.id === "mega"),
    );
  }
  if (isMessageRant(msg)) {
    appropiateReactions.push(
      ...cache["reactions"]?.filter((reaction: any) => reaction.id === "rant"),
    );
  }
  appropiateReactions.push(
    ...cache["reactions"]?.filter(
      (reaction: any) =>
        reaction.keywords.filter((keyword: string) =>
          msg.content.toLowerCase().includes(keyword),
        ).length === reaction.keywords.length && reaction.keywords.length > 0,
    ),
  );

  if (appropiateReactions.length === 0) {
    return;
  }
  const chosenTrigger = chooseRandom(appropiateReactions);
  const chosenReaction = chosenTrigger.reaction_list.find(
    (reaction: IReactionDetails) => happensWithAChanceOf(reaction.chance),
  );
  if (chosenReaction) {
    chosenReaction.emoji && msg.react(chosenReaction.emoji);
    chosenReaction.response && msg.channel.send(chosenReaction.response);
    chosenReaction.function &&
      Reaction[chosenReaction.function] &&
      Reaction[chosenReaction.function](msg);
  }
};
const commandObject = (msg: Discord.Message) =>
  cache["commands"].find(cmd => cmd.keyword === getKeyword(msg));

const badgeCreationActive = () => cache["addbadge"].inProgress;

// MAIN FUNCTION

const classifyMessage = (msg: Discord.Message): void => {
  if (isUserBot(msg)) {
    return;
  }
  if (isChannelDM(msg) && !isUserArcy(msg)) {
    answer(msg, "Only my glorious creator can talk to me in private.");
    return;
  }
  if (messageStartsWithCommandSymbol(msg)) {
    answerCommand(msg);
    return;
  }
  if (badgeCreationActive()) {
    badgeCreation(msg);
    return;
  }
  checkForReactionTriggers(msg);
};

export { classifyMessage, isUserAdmin };
