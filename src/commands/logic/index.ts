import { CommandFn } from "arcybot/dist/CommandList";

import { update } from "./admin";
import { meme, memelist, addmeme, deletememe } from "./meme";
import { createbadge, deletebadge, givebadge, revokebadge } from "./badges";

const adminFn: CommandFn[] = [update];
const memeFn: CommandFn[] = [meme, memelist, addmeme, deletememe];
const badgeFn: CommandFn[] = [createbadge, deletebadge, givebadge, revokebadge];

export const commandsFunctions = [...adminFn, ...badgeFn, ...memeFn];
