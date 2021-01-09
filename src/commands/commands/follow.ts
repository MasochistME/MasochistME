import Discord from "discord.js";
import { log } from "utils/log";
import { createEmbed, removeKeyword, isLink } from "utils/helpers";
import { upsertOne, updateCache } from "utils/db";
import { cache } from "utils/cache";
import { informFollowers } from "utils/stream";

export const follow = (msg: Discord.Message): void => {
  let embed: Discord.MessageEmbed;
  let content = "";
  let usersToFollow = msg.mentions.users.map(streamer => streamer.id);
  const usersToNotFollow: any[] = [];

  cache["follow"].map((streamer: any) => {
    if (
      streamer?.id &&
      usersToFollow.includes(streamer?.id) &&
      streamer.followers.includes(msg.author?.id)
    ) {
      usersToNotFollow.push(streamer.id);
    }
  });
  usersToFollow = usersToFollow.filter(
    user => !usersToNotFollow.includes(user),
  );

  if (usersToNotFollow.length > 0) {
    content += `You already follow ${usersToNotFollow
      .map(
        user =>
          msg.guild?.members.cache.find(member => member.id === user)?.user
            .username,
      )
      .join(", ")}. Why do you even bother?\n`;
  }
  if (usersToFollow.length > 0) {
    content += `${msg.author.username} now follows ${usersToFollow
      .map(
        user =>
          msg.guild?.members.cache.find(member => member.id === user)?.user
            .username,
      )
      .join(", ")}! What a waste of time.`;
  }
  if (msg.mentions.users.map(streamer => streamer.id).length === 0) {
    embed = createEmbed("<:boshy:310151885690503169> Incorrect input", [
      {
        title: "---",
        content: "You didn't mention users who you want to follow.",
      },
    ]);
  } else {
    embed = createEmbed("Follower alert", [{ title: "---", content }]);
    usersToFollow.map(user => {
      let followers = cache["follow"].find(streamer => streamer.id === user);
      if (!followers) {
        followers = {
          id: user,
          followers: [msg.author.id],
        };
      } else {
        followers.followers.push(msg.author.id);
      }
      upsertOne("fetus", "follow", { id: user }, followers, err => {
        if (err) {
          embed = createEmbed(
            "<:boshy:310151885690503169> Something went wrong",
            [{ title: "---", content: err }],
          );
          log.WARN(err);
          msg.channel.send(embed);
          return;
        }
        updateCache("fetus");
      });
    });
  }
  msg.channel.send(embed);
};

export const unfollow = (msg: Discord.Message): void => {
  let embed: Discord.MessageEmbed;
  let content = "";
  const usersToUnfollow: any[] = [];
  let usersToNotUnfollow = msg.mentions.users.map(streamer => streamer.id);

  cache["follow"].map(streamer => {
    if (
      streamer?.id &&
      streamer.followers.includes(msg.author.id) &&
      usersToNotUnfollow.includes(streamer.id)
    ) {
      usersToUnfollow.push(streamer.id);
    }
  });
  usersToNotUnfollow = usersToNotUnfollow.filter(
    user => !usersToUnfollow.includes(user),
  );

  if (usersToNotUnfollow.length > 0) {
    content += `You don't follow ${usersToNotUnfollow
      .map(
        user =>
          msg.guild?.members.cache.find(member => member.id === user)?.user
            .username,
      )
      .join(", ")}, you fool.\n`;
  }
  if (usersToUnfollow.length > 0) {
    content += `${msg.author.username} no longer follows ${usersToUnfollow
      .map(
        user =>
          msg.guild?.members.cache.find(member => member.id === user)?.user
            .username,
      )
      .join(", ")}. It was boring anyway.`;
  }
  if (msg.mentions.users.map(streamer => streamer.id).length === 0) {
    embed = createEmbed("<:boshy:310151885690503169> Incorrect input", [
      {
        title: "---",
        content: "You didn't mention users who you want to unfollow.",
      },
    ]);
  } else {
    embed = createEmbed("Unfollower alert", [{ title: "---", content }]);
    usersToUnfollow.map(user => {
      const followers = cache["follow"].find(streamer => streamer.id === user);
      if (followers) {
        followers.followers = followers.followers.filter(
          follower => follower !== msg.author.id,
        );
        upsertOne("fetus", "follow", { id: user }, followers, err => {
          if (err) {
            embed = createEmbed(
              "<:boshy:310151885690503169> Something went wrong",
              [{ title: "---", content: err }],
            );
            log.WARN(err);
            msg.channel.send(embed);
            return;
          }
          updateCache("fetus");
        });
      }
    });
  }
  msg.channel.send(embed);
};

export const followers = (msg: Discord.Message): void => {
  const followers = cache["follow"].find(user => user.id === msg.author.id);
  let followingUsers: any[] = [];
  let content = "- ";

  if (followers) {
    followingUsers = followers.followers.map(follower => {
      const member = msg.guild?.members.cache.find(m => m.id === follower);
      if (member?.user?.username) {
        return member.user.username;
      } else {
        return "?";
      }
    });
  }

  if (followingUsers?.length) {
    content =
      "No one follows you yet.\n\nYou don't even have any friends. So sad.";
  } else {
    content += followingUsers.join("\n- ");
  }
  const embed: Discord.MessageEmbed = createEmbed("Users that follow you", [
    { title: "---", content },
  ]);
  msg.channel.send(embed);
};

export const following = (msg: Discord.Message): void => {
  const following = cache["follow"]
    .filter(streamer => streamer.followers.includes(msg.author.id))
    .map(streamer => {
      const member = msg.guild?.members.cache.find(m => m.id === streamer.id);
      if (member?.user?.username) {
        return member.user.username;
      } else {
        return "?";
      }
    });
  let content = "- ";

  if (following.length === 0) {
    content = "No one.";
  } else {
    content += following.join("\n- ");
  }
  const embed: Discord.MessageEmbed = createEmbed("Users followed by you", [
    { title: "---", content },
  ]);
  msg.channel.send(embed);
};

export const live = (msg: Discord.Message): void => {
  const member = msg.guild?.members.cache.find(
    member => member.id === msg.author.id,
  );
  const url = removeKeyword(msg);

  if (url.length === 0) {
    msg.channel.send("You forgot about something, dumbass.");
    return;
  }
  if (!isLink(url)) {
    msg.channel.send("_This_ is not a link.");
    return;
  }

  informFollowers(member, url);
};
