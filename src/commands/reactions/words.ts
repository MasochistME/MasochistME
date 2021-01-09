import Discord from "discord.js";
import nlp from "compromise";
import { happensWithAChanceOf } from "utils/rng";
import { cache } from "utils/cache";

export const fuck = (msg: Discord.Message): void => {
  const listOfAvoidThose =
    cache["special"].find(special => special.id === "nofuckstogive").list || [];
  const customizeFuck = () => {
    const message = nlp(msg.content);
    let thingToFuck: string | null = null;
    if (message.has("^fuck #Determiner #Noun")) {
      thingToFuck = message
        .match("^fuck")
        .lookAhead("#Determiner #Noun")
        .text();
    }
    if (message.has("^fuck #Verb")) {
      thingToFuck = message.match("^fuck").lookAhead("#Verb").text();
    }
    if (message.has("^fuck #Noun")) {
      thingToFuck = message.match("^fuck").lookAhead("#Noun").text();
      if (
        thingToFuck === "arcy" ||
        thingToFuck === "arcyvilk" ||
        thingToFuck === "<@165962236009906176>"
      ) {
        thingToFuck = "... Actually no, fuck _you_";
      }
      if (thingToFuck === "you") {
        thingToFuck = "you too";
      }
      if (thingToFuck === "me") {
        thingToFuck = "you!";
      }
      if (
        thingToFuck === "fetus" ||
        thingToFuck === "dr fetus" ||
        thingToFuck === "dr. fetus" ||
        thingToFuck === "doctor fetus"
      ) {
        thingToFuck = "fetus! ...wait _what_...";
      }
    }
    return thingToFuck;
  };
  const thingToFuck = customizeFuck();
  if (thingToFuck && !listOfAvoidThose.includes(thingToFuck.toLowerCase())) {
    msg.channel.send(`Yeah! Fuck ${thingToFuck}!`);
  }
};

export const mega = (msg: Discord.Message): void => {
  const sentenceArray = msg.content.toLowerCase().split(" ");
  if (sentenceArray.includes("hi")) {
    msg.channel.send("Hi Mega <:hi:435199913199009793>");
    return;
  } else {
    if (happensWithAChanceOf(10)) {
      msg.channel.send("Hi Mega <:hi:435199913199009793>");
      return;
    }
  }
};
