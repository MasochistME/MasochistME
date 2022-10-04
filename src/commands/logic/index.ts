import { CommandFn } from "arcybot/dist/CommandList";

import { meme, memelist, addmeme, deletememe } from "./meme";
import { createbadge, deletebadge, givebadge, revokebadge } from "./badges";

const memeFn: CommandFn[] = [meme, memelist, addmeme, deletememe];
const badgeFn: CommandFn[] = [createbadge, deletebadge, givebadge, revokebadge];

export const commandsFunctions = [...badgeFn, ...memeFn];
