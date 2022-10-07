import { DiscordInteraction } from "arcybot";

import { cache } from "fetus";
import { UNKNOWN_NAME } from "consts";
import { ButtonInteraction } from "discord.js";

export const getOption = (key: string) =>
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

export const getBadgeNameById = (id?: string | null): string => {
  if (!id) return UNKNOWN_NAME;
  const badge = cache.badges.find(b => b.id === id);
  return badge?.name ?? UNKNOWN_NAME;
};

export const getMemberNameById = (id?: string | null): string => {
  if (!id) return UNKNOWN_NAME;
  const member = cache.members.find(m => m.id === id);
  return member?.name ?? UNKNOWN_NAME;
};
