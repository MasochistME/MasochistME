import Discord from "discord.js";
import axios from "axios";
import _ from "lodash";
import { createEmbed } from "utils/helpers";

export const showmembers = (msg: Discord.Message): void => {
  const url = "http://localhost:3002/rest/users";
  axios
    .get(url)
    .then(response => {
      if (response.data) {
        const users = _.orderBy(
          response.data,
          user => user.name.toLowerCase(),
          ["asc"],
        );
        let members = "";

        users.map(user => {
          if (`${members}\n- **${user.name}** - ${user.id}`.length >= 1024) {
            const embed = createEmbed("Members", [
              { title: "___", content: members },
            ]);
            msg.channel.send(embed);
            members = "";
          }
          members += `\n- **${user.name}** - ${user.id}`;
        });

        const embed = createEmbed("Members", [
          { title: "___", content: members },
        ]);
        msg.channel.send(embed);
      }
    })
    .catch(err => msg.channel.send(`Error: ${err}`));
};
