import {
  createbadgeBuilder,
  editbadgeBuilder,
  deletebadgeBuilder,
  givebadgeBuilder,
  revokebadgeBuilder,
} from "./badgeBuilder";
import { addmemeBuilder, deletememeBuilder } from "./memeBuilder";
import { vidBuilder } from "./userBuilder";

const badgeBuilders = [
  deletebadgeBuilder,
  editbadgeBuilder,
  createbadgeBuilder,
  givebadgeBuilder,
  revokebadgeBuilder,
];
const memeBuilders = [addmemeBuilder, deletememeBuilder];
const userBuilders = [vidBuilder];

export const customCommands = [
  ...badgeBuilders,
  ...memeBuilders,
  ...userBuilders,
];
