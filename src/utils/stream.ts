import Discord from "discord.js";
import { cache } from "utils/cache";
import { userHasRoleId } from "commands/roles";
import { log } from "utils/log";
import { createEmbed } from "utils/helpers";

const streamRoleId = (member: Discord.GuildMember): string | undefined => {
  const streamRoleName = cache["options"].find(
    option => option.option === "role_stream",
  )
    ? cache["options"].find(option => option.option === "role_stream").value
    : undefined;
  const streamRoleId =
    streamRoleName &&
    member.guild.roles.cache.find(role => role.name === streamRoleName)
      ? member.guild.roles.cache.find(role => role.name === streamRoleName)?.id
      : undefined;
  return streamRoleId;
};

const addStreamRole = (member: Discord.GuildMember): void => {
  const role = streamRoleId(member);
  if (role && !userHasRoleId(member, role)) {
    member.roles.add(role).catch(err => console.trace(err));
    informFollowers(member);
  }
};
const removeStreamRole = (member: Discord.GuildMember): void => {
  const role = streamRoleId(member);
  if (role && userHasRoleId(member, role)) {
    member.roles.add(role).catch(err => console.trace(err));
  }
};

export const informFollowers = (
  member: Discord.GuildMember | undefined,
  url?: string,
): void => {
  if (!member) {
    return;
  }
  const followers = cache["follow"].find(
    streamer => streamer.id === member?.id,
  );
  const room_stream = cache["options"].find(
    option => option.option === "room_stream",
  )
    ? cache["options"].find(option => option.option === "room_stream").value
    : null;
  const channel = cache["bot"].channels.cache.get(room_stream);

  if (!followers || followers.followers.length === 0) {
    return;
  }
  if (!channel) {
    log.WARN("Room_stream channel is not set up.");
    return;
  }
  const embed: Discord.MessageEmbed = createEmbed(
    `${member?.user?.username.toUpperCase()} started streaming!`,
    [
      {
        title: "---",
        content: url || member.presence.activities[0].url || "Unknown url :(",
      },
    ],
  );

  channel.send(embed);
  channel.send(
    `**Tagging:** ${followers.followers.map(f => `<@${f}>`).join(", ")}`,
  );
};

export const handleStream = (
  oldMember: Discord.GuildMember,
  newMember: Discord.GuildMember,
): void => {
  const game = newMember.presence.activities[0];

  if (game && game.url) {
    addStreamRole(newMember);
  }
  if (!game || (game && !game.url)) {
    removeStreamRole(newMember);
  }
};
