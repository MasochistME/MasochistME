import Discord from "discord.js";
import { ObjectId } from "mongodb";
import axios from "axios";
import _ from "lodash";
import { insertMany, deleteOne } from "utils/db";
import { createEmbed, removeKeyword, extractArguments } from "utils/helpers";
import { cache } from "utils/cache";
import { log } from "utils/log";

const timeout = 300000;
const fields: Array<string> = [
  "game id",
  "name",
  "image",
  "points",
  "requirements",
  "description",
];

export const editbadge = (msg: Discord.Message): void => {
  // const badgeId = removeKeyword(msg);

  // if (!badgeId) {
  //     msg.channel.send(createEmbed('Invalid badge ID', [{ title: '\_\_\_', content: 'Cannot edit badge that doesn\'t exist.' }]));
  //     return;
  // }

  // const badge = cache["badges"].find(b => b['_id'] == badgeId);

  // if (!badge) {
  //     msg.channel.send(createEmbed('Invalid badge ID', [{ title: '\_\_\_', content: 'Cannot edit badge that doesn\'t exist.' }]));
  //     return;
  // }
  msg.channel.send("This is WIP!");
};

export const deletebadge = (msg: Discord.Message): void => {
  const badgeId = removeKeyword(msg);

  if (!badgeId) {
    msg.channel.send(
      createEmbed("Invalid badge ID", [
        { title: "___", content: "Cannot delete badge that doesn't exist." },
      ]),
    );
    return;
  }

  const badge = cache["badges"].find(b => b["_id"] === badgeId);

  if (!badge) {
    msg.channel.send(
      createEmbed("Invalid badge ID", [
        { title: "___", content: "Cannot delete badge that doesn't exist." },
      ]),
    );
    return;
  } else {
    deleteOne("masochist", "badges", { _id: ObjectId(badgeId) }, err =>
      err ? msg.react("❌") : msg.react("✅"),
    );
  }
};

export const givebadge = (msg: Discord.Message): void => {
  const [badgeId, userId] = extractArguments(msg);

  if (!badgeId || !userId) {
    msg.channel.send(
      createEmbed("Invalid syntax", [
        { title: "___", content: "Badge or user is invalid." },
      ]),
    );
    return;
  }

  const badge = cache["badges"].find(b => b["_id"] === badgeId);
  const user = cache["users"].find(u => u.id === userId);
  const url = `http://localhost:3002/rest/badges/badge/${badgeId}/user/${userId}`;

  if (!badge || !user) {
    msg.channel.send(
      createEmbed("Invalid ID", [
        { title: "___", content: "Badge or user doesn't exist." },
      ]),
    );
    return;
  }

  axios
    .put(url)
    .then(() => msg.channel.send("Given! :3"))
    .catch(error => msg.channel.send(`Error: ${error}`));
};

export const takebadge = (msg: Discord.Message): void => {
  const [badgeId, userId] = extractArguments(msg);

  if (!badgeId || !userId) {
    msg.channel.send(
      createEmbed("Invalid syntax", [
        { title: "___", content: "Badge or user is invalid." },
      ]),
    );
    return;
  }

  const badge = cache["badges"].find(b => b["_id"] === badgeId);
  const user = cache["users"].find(u => u.id === userId);
  const url = `http://localhost:3002/rest/badges/badge/${badgeId}/user/${userId}`;

  if (!badge || !user) {
    msg.channel.send(
      createEmbed("Invalid ID", [
        { title: "___", content: "Badge or user doesn't exist." },
      ]),
    );
    return;
  }

  axios
    .delete(url)
    .then(() => msg.channel.send("Taken! :3"))
    .catch(error => msg.channel.send(`Error: ${error}`));
};

export const badgelist = (msg: Discord.Message): void => {
  let badges = "";

  cache["badges"] = _.orderBy(cache["badges"], ["gameId"], ["asc"]);
  cache["badges"].map(badge => {
    if (
      `${badges}\`\`${badge._id}\`\` - ${badge.name.toUpperCase()} - ${
        badge.description
      }\n`.length >= 1024
    ) {
      const embed = createEmbed("🥇 List of badges", [
        { title: "___", content: badges },
      ]);
      msg.channel.send(embed);
      badges = "";
    }
    badges += `\`\`${badge._id}\`\` - ${badge.name.toUpperCase()} - ${
      badge.description
    }\n`;
  });

  const embed = createEmbed("🥇 List of badges", [
    { title: "___", content: badges },
  ]);
  msg.channel.send(embed);
};

// addbadge stuff
export const addbadge = (msg: Discord.Message): void => {
  cache["addbadge"].inProgress = true;
  cache["addbadge"].activeField = fields[0].replace(" ", "");

  const embed = badgeScreenEmbed();

  msg.channel
    .send(embed)
    .then(sentEmbed => {
      const reactions = ["✅", "❌"];
      const iterateReactions = (index: number) => {
        if (index >= reactions.length) {
          return;
        }
        // @ts-ignore:next-line
        sentEmbed.react(reactions[index]);
        setTimeout(() => iterateReactions(index + 1), 500);
      };
      iterateReactions(0);
      // @ts-ignore:next-line
      cache["addbadge"].msgId = sentEmbed.id;
      cache["addbadge"].authorId = msg.author.id;
      cache["addbadge"].channelId = msg.channel.id;
      log.INFO("Badge creation start detected!");
      log.INFO(JSON.stringify(cache["addbadge"]));
      const filter = (reaction, user) =>
        user.id === cache["addbadge"].authorId &&
        (reaction.emoji.name === "❌" || reaction.emoji.name === "✅");
      // @ts-ignore:next-line
      sentEmbed
        .awaitReactions(filter, {
          time: timeout,
          maxEmojis: 1,
        })
        .then(collected => finalizeBadge(collected))
        .catch(e => console.log(e));
    })
    .catch(err => log.WARN(err));
};

const badgeScreenEmbed = (footer?: string): Discord.MessageEmbed => {
  const content = fields.map(field => {
    const fieldNoSpaces = field.replace(" ", "");
    return {
      title: cache["addbadge"].badge[fieldNoSpaces]
        ? `✅ ${field}`
        : cache["addbadge"].activeField === fieldNoSpaces
        ? `➡ ${field}`
        : `🔲 ${field}`,
      content: cache["addbadge"].badge[fieldNoSpaces]
        ? cache["addbadge"].badge[fieldNoSpaces]
        : "-",
      inline: true,
    };
  });
  return createEmbed(
    "🥇 Badge adding screen",
    [
      ...content,
      {
        title: "Instruction",
        content: `Field indicated by ️️️➡️ is the one you are filling now.
                \nIf the badge is for non-Steam game, write its name in \`\`game id\`\` field.
                \n✅ to save, ❌ to cancel.`,
        inline: false,
      },
    ],
    "0xFDC000",
    cache["addbadge"].badge.image
      ? cache["addbadge"].badge.image
      : "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/question.png",
    footer
      ? footer
      : `Unfinished badge expires at ${new Date(
          Date.now() + timeout,
        ).toLocaleString()}.`,
  );
};

export const badgeCreation = (msg: Discord.Message): void => {
  if (
    !cache["addbadge"].inProgress ||
    msg.author.id !== cache["addbadge"].authorId ||
    msg.channel.id !== cache["addbadge"].channelId
  ) {
    return;
  }
  const activeField = cache["addbadge"].activeField;
  const nextFieldIndex =
    fields.findIndex(field => field.replace(" ", "") === activeField) + 1;

  cache["addbadge"].badge[activeField] = msg.content.trim(); //add some validation

  if (nextFieldIndex < fields.length) {
    cache["addbadge"].activeField = fields[nextFieldIndex].replace(" ", "");
  } else {
    cache["addbadge"].activeField = "";
  }

  msg.channel.messages
    .fetch(cache["addbadge"].msgId)
    .then(message => message.edit(badgeScreenEmbed()));
};

export const finalizeBadge = (collected: any): void => {
  let isNonSteamGame = false;
  collected = collected.map(col => {
    return {
      name: col.emoji.name,
      message: col.message,
    };
  })[0];
  if (!collected) {
    expireBadge(`Badge expired at ${new Date(Date.now()).toLocaleString()}.`);
    return;
  }
  if (collected.name === "❌") {
    const embed = createEmbed("❌ Badge cancelled", [
      { title: "___", content: "Good, it sucked anyway." },
    ]);
    collected.message.channel.send(embed);
    expireBadge(`Badge cancelled at ${new Date(Date.now()).toLocaleString()}.`);
    return;
  }
  if (isNaN(parseInt(cache["addbadge"].badge.gameid))) {
    isNonSteamGame = true;
  }
  if (collected.name === "✅") {
    insertMany(
      "masochist",
      "badges",
      [
        {
          name: cache["addbadge"].badge.name,
          img: cache["addbadge"].badge.image,
          points: cache["addbadge"].badge.points,
          requirements: cache["addbadge"].badge.requirements,
          description: cache["addbadge"].badge.description,
          gameId: isNonSteamGame ? null : cache["addbadge"].badge.gameid,
          game: isNonSteamGame ? cache["addbadge"].badge.gameid : null,
          enabled: true,
          legacy: false,
          isNonSteamGame,
        },
      ],
      err => {
        if (err) {
          collected.message.channel.send(
            createEmbed("❌ Error saving badge", [
              { title: "___", content: err },
            ]),
          );
          expireBadge(
            `Badge cancelled at ${new Date(Date.now()).toLocaleString()}.`,
          );
          return;
        }
        collected.message.channel.send(
          createEmbed("✅ Badge added", [
            { title: "___", content: "Done, fucker." },
          ]),
        );
        expireBadge(`Badge saved at ${new Date(Date.now()).toLocaleString()}.`);
      },
    );
  }
};

const clearBadge = (): void => {
  cache["addbadge"] = {
    inProgress: false,
    msgId: "",
    authorId: "",
    channelId: "",
    activeField: "",
    badge: {},
  };
};

const expireBadge = (footer?: string): void => {
  const badgeRoom = cache["addbadge"].channelId;
  const channel = cache["bot"].channels.get(badgeRoom);
  channel.fetchMessage(cache["addbadge"].msgId).then(message => {
    message.edit(badgeScreenEmbed(footer));
    message
      .clearReactions()
      .then(() => clearBadge())
      .catch(err => log.WARN(err));
  });
};
