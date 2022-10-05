import { cache } from "fetus";
import { UNKNOWN_NAME } from "consts";

export const getBadgeNameById = (id?: string | null): string => {
  if (!id) return UNKNOWN_NAME;
  const badge = cache.badges.find(b => b.id === id);
  return badge?.name ?? UNKNOWN_NAME;
};

export const getMemberNameById = (id?: string | null): string => {
  if (!id) return UNKNOWN_NAME;
  const member = cache.members.find(m => m.id === id);
  return member?.name ?? UNKNOWN_NAME;
};
