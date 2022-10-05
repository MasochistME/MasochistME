import { CommandFn } from "arcybot";

import { vid } from "./misc";
import { update } from "./admin";
import { profile } from "./user";
import { register } from "./register";
import { meme, memelist, memeadd, memedelete } from "./meme";
import {
  badgecreate,
  badgeedit,
  badgedelete,
  badgegive,
  badgerevoke,
} from "./badges";

const adminFn: CommandFn[] = [update];
const userFn: CommandFn[] = [register, profile];
const memeFn: CommandFn[] = [meme, memelist, memeadd, memedelete];
const badgeFn: CommandFn[] = [
  badgecreate,
  badgeedit,
  badgedelete,
  badgegive,
  badgerevoke,
];
const miscFn: CommandFn[] = [vid];

export const commandsFunctions = [
  ...userFn,
  ...adminFn,
  ...badgeFn,
  ...memeFn,
  ...miscFn,
];
