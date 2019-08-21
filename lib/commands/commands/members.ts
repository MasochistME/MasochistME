import Discord from "discord.js";
import axios from 'axios';
import _ from 'lodash';
import { createEmbed } from '../../helpers';
import { log } from '../../../log';
import { cache } from '../../../cache';


export const showmembers = (msg:Discord.Message) => {
    const url = 'http://localhost:3002/rest/users';
    axios.get(url)
        .then(response => {
            if (response.data) {
                const users = _.orderBy(response.data, user => user.name.toLowerCase(), ['asc']);
                let members = '';

                users.map(user => {
                    if (`${members}\n- **${user.name}** - ${user.id}`.length >= 1024) {
                        const embed = createEmbed('Members', [{ title: '\_\_\_', content: members }]);
                        msg.channel.send(embed);
                        members = '';
                    }
                    members += `\n- **${user.name}** - ${user.id}`;
                })
            }
        })
        .catch(err => msg.channel.send(`Error: ${err}`));
}
