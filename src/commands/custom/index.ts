import {
  badgeCreateBuilder,
  badgeEditBuilder,
  badgeDeleteBuilder,
  badgeGiveBuilder,
  badgeRevokeBuilder,
} from "./badgeBuilder";
import { memeAddBuilder, memeDeleteBuilder } from "./memeBuilder";
import { registerBuilder } from "./userBuilder";
import { vidBuilder } from "./miscBuilder";

const badgeBuilders = [
  badgeCreateBuilder,
  badgeEditBuilder,
  badgeDeleteBuilder,
  badgeGiveBuilder,
  badgeRevokeBuilder,
];
const memeBuilders = [memeAddBuilder, memeDeleteBuilder];
const miscBuilders = [vidBuilder];
const userBuilders = [registerBuilder];

export const customCommands = [
  ...badgeBuilders,
  ...memeBuilders,
  ...userBuilders,
  ...miscBuilders,
];
