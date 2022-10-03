import { CommandFn } from "arcybot/dist/CommandList";

import { meme, memelist, addmeme, deletememe } from "./meme";
import { givebadge, revokebadge } from "./badges";

const memeFn: CommandFn[] = [meme, memelist, addmeme, deletememe];
const badgeFn: CommandFn[] = [givebadge, revokebadge];

export const commandsFunctions = [...badgeFn, ...memeFn];
