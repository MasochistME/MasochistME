import { givebadgeBuilder, revokebadgeBuilder } from "./badgeBuilder";
import { addmemeBuilder, deletememeBuilder } from "./memeBuilder";

const badgeBuilders = [givebadgeBuilder, revokebadgeBuilder];
const memeBuilders = [addmemeBuilder, deletememeBuilder];

export const customCommands = [...badgeBuilders, memeBuilders];
