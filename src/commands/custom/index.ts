import {
  badgeCreateBuilder,
  badgeEditBuilder,
  badgeDeleteBuilder,
  badgeGiveBuilder,
  badgeRevokeBuilder,
} from "./badgeBuilder";
import { memeAddBuilder, memeDeleteBuilder } from "./memeBuilder";
import { vidBuilder } from "./userBuilder";

const badgeBuilders = [
  badgeCreateBuilder,
  badgeEditBuilder,
  badgeDeleteBuilder,
  badgeGiveBuilder,
  badgeRevokeBuilder,
];
const memeBuilders = [memeAddBuilder, memeDeleteBuilder];
const userBuilders = [vidBuilder];

export const customCommands = [
  ...badgeBuilders,
  ...memeBuilders,
  ...userBuilders,
];
