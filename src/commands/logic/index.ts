import { CommandFn } from "arcybot";

import { update } from "./admin";
import { vid } from "./user";
import { meme, memelist, memeadd, memedelete } from "./meme";
import {
  badgecreate,
  badgeedit,
  badgedelete,
  badgegive,
  badgerevoke,
} from "./badges";

const adminFn: CommandFn[] = [update];
const userFn: CommandFn[] = [vid];
const memeFn: CommandFn[] = [meme, memelist, memeadd, memedelete];
const badgeFn: CommandFn[] = [
  badgecreate,
  badgeedit,
  badgedelete,
  badgegive,
  badgerevoke,
];

export const commandsFunctions = [...userFn, ...adminFn, ...badgeFn, ...memeFn];
