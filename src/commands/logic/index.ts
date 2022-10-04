import { CommandFn } from "arcybot";

import { update } from "./admin";
import { vid } from "./user";
import { meme, memelist, addmeme, deletememe } from "./meme";
import {
  createbadge,
  editbadge,
  deletebadge,
  givebadge,
  revokebadge,
} from "./badges";

const adminFn: CommandFn[] = [update];
const userFn: CommandFn[] = [vid];
const memeFn: CommandFn[] = [meme, memelist, addmeme, deletememe];
const badgeFn: CommandFn[] = [
  createbadge,
  editbadge,
  deletebadge,
  givebadge,
  revokebadge,
];

export const commandsFunctions = [...userFn, ...adminFn, ...badgeFn, ...memeFn];
