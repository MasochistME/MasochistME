import { DiscordInteraction } from "arcybot";

import { bot, cache, sdk } from "fetus";
import { Room, UNKNOWN_NAME } from "consts";
import { ButtonInteraction, DMChannel } from "discord.js";

export const getOption = <T>(key: string): T =>
  cache.options.find(option => option.option === key)?.value;

export const getChannelById = (
  interaction: DiscordInteraction | ButtonInteraction,
  channelId?: string,
) => {
  const channel = interaction.guild?.channels.cache.find(
    ch => ch.id === channelId,
  );
  if (channel?.isTextBased()) return channel;
  return null;
};

export const getChannelByKey = (roomKey: string) => {
  const room = getOption(roomKey);
  const channel = bot.botClient.channels.cache.find(ch => ch.id === room);
  if (channel?.isTextBased()) return channel;
  return null;
};

export const getModChannel = (isRaceRoom?: boolean) => {
  const modRoom = getOption(isRaceRoom ? Room.RACE_MOD : Room.MOD);
  const channel = bot.botClient.channels.cache.find(ch => ch.id === modRoom);
  if (channel?.isTextBased()) return channel;
  return null;
};

export const getDMChannel = (memberId: string): DMChannel | null => {
  const user = bot.botClient.users.cache.find(ch => ch.id === memberId);
  return user as unknown as DMChannel;
};

export const getBadgeNameById = (badgeId?: string | null): string => {
  if (!badgeId) return UNKNOWN_NAME;
  const badge = cache.badges.find(b => String(b._id) === badgeId);
  return badge?.name ?? UNKNOWN_NAME;
};

export const getMemberNameById = (id?: string | null): string => {
  if (!id) return UNKNOWN_NAME;
  const member = cache.members.find(m => m.id === id || m.discordId === id);
  return member?.name ?? UNKNOWN_NAME;
};

export const getIsUserRegistered = async (discordId: string) => {
  try {
    const member = await sdk.getMemberById({ discordId });
    if (member) return true;
    return false;
  } catch (error) {
    // Mongo returns 404 if user does not exist
    return false;
  }
};

export const getFileExtension = (url: string): string | null => {
  const regex = new RegExp(/([^\.]*)$/i);
  const extension = regex.exec(url)?.[0] ?? null;
  return extension;
};
