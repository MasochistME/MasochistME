import { DiscordInteraction } from "arcybot";
import { Message, ButtonInteraction, MessageCollector } from "discord.js";

export const awaitMessage = async <
  T extends DiscordInteraction | ButtonInteraction,
>(
  interaction: T,
  filter: (msg: Message) => boolean,
  time = 30000,
): Promise<Message<boolean> | undefined> =>
  new Promise((resolve, reject) => {
    const channel = interaction?.channel;
    if (!channel) {
      reject({
        message: "Could not find this channel. It's stupid, yes, I know.",
      });
      return;
    }

    const messageCollector = new MessageCollector(channel, {
      filter,
      max: 1,
      time,
    });

    messageCollector.on("collect", async () => {
      messageCollector.stop();
    });

    messageCollector.on("end", async collected => {
      if (collected.size) {
        const reply = collected.first();
        resolve(reply);
      } else {
        reject({
          message:
            "You won't be able to send a screenshot with your proof anymore because this race has ended.",
        });
      }
    });
  });
