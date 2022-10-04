import {
  createbadgeBuilder,
  deletebadgeBuilder,
  givebadgeBuilder,
  revokebadgeBuilder,
} from "./badgeBuilder";
import { addmemeBuilder, deletememeBuilder } from "./memeBuilder";

const badgeBuilders = [
  deletebadgeBuilder,
  createbadgeBuilder,
  givebadgeBuilder,
  revokebadgeBuilder,
];
const memeBuilders = [addmemeBuilder, deletememeBuilder];

export const customCommands = [...badgeBuilders, ...memeBuilders];
