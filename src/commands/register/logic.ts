import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { DiscordInteraction, getSuccessEmbed, getErrorEmbed } from "arcybot";

import { REGISTRATION_REVIEW, Room } from "consts";
import { getChannelById, getMemberNameById, getOption } from "utils";

/**
 * Allows user to sent their MasochistME link for the mod approval
 * and connection of MasochistME profile to Discord profile
 * @param interaction DiscordInteraction
 * @return void
 */
export const register = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const regex = new RegExp(/(?<=masochist.me\/profile\/).*/);
  const link = interaction.options.getString("link", true);

  const isMasochistLink = regex.test(link);
  const steamId = link.match(regex)?.[0];
  const steamUsername = getMemberNameById(steamId);

  if (!isMasochistLink ?? !steamId) {
    interaction.reply(
      getErrorEmbed(
        "Incorrect link",
        "The link you provided is not a correct Masochist.ME profile.",
        true,
      ),
    );
    return;
  }

  const modRoomId = getOption<string>(Room.MOD);
  const channel = getChannelById(interaction, modRoomId);

  await channel?.send({
    embeds: [getModApprovalEmbed(interaction, steamId, steamUsername)],
    components: [getModApprovalButtons()],
  });

  interaction.reply(
    getSuccessEmbed(
      "Success!",
      "Your registration request has been sent to the mod team. Please wait for their approval.",
    ),
  );
};

/**
 * Creates a row of buttons - approve and reject - for the mod review of user registration
 * @return ActionRowBuilder<ButtonBuilder>
 */
const getModApprovalButtons = () => {
  const buttonApprove = new ButtonBuilder()
    .setCustomId(`${REGISTRATION_REVIEW}_APPROVE`)
    .setLabel("Approve")
    .setStyle(ButtonStyle.Success);
  const buttonReject = new ButtonBuilder()
    .setCustomId(`${REGISTRATION_REVIEW}_REJECT`)
    .setLabel("Reject")
    .setStyle(ButtonStyle.Danger);
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttonApprove,
    buttonReject,
  );

  return buttonBar;
};

/**
 * Creates an embed for the mod review of user registration
 * @param interaction DiscordInteraction
 * @param steamId string - user's Steam ID
 * @return APIEmbed
 */
const getModApprovalEmbed = (
  interaction: DiscordInteraction,
  steamId: string,
  steamUsername: string,
) => {
  const embed: APIEmbed = {
    title: "🔧 User registration request",
    fields: [
      {
        name: "User",
        value: `<@${interaction.user.id}>`,
        inline: true,
      },
      {
        name: "Requested Steam",
        value: steamUsername,
        inline: true,
      },
      {
        name: "Steam ID",
        value: steamId,
        inline: true,
      },
      {
        name: "Steam profile",
        value: `https://steamcommunity.com/profiles/${steamId}`,
      },
      {
        name: "Masochist.ME link",
        value: `http://masochist.me/profile/${steamId}`,
      },
    ],
  };

  return embed;
};
