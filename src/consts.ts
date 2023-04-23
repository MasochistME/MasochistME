export const DISCORD_MAX_MSG_LENGTH = 2000;
export const API_URL = "http://65.108.214.190:3002/api";

export const UNKNOWN = "UNKNOWN";
export const UNKNOWN_NAME = "<UNKNOWN NAME>";

export const USER_NO_DESCRIPTION = "This user does not have description yet.";

// Timeouts
export const RACE_TIMEOUT = 1000 * 60;
export const RACE_RESULTS_TIMEOUT = 1000 * 60 * 60;

// Rooms
export enum Room {
  LOG = "room_log",
  MOD = "room_mod",
  VID = "room_vid",
  RACE_CURRENT = "room_race",
  RACE_PAST = "room_race_past",
  RACE_MOD = "room_race_mod",
}

export enum RoleOption {
  ROLE_RACE = "role_race",
  IAM_ROLES = "iam_roles",
}

// Custom interaction IDs
export const FEATURE_VIDEO = "FEATURE_VIDEO";
export const REGISTRATION_REVIEW = "REGISTRATION_REVIEW";
export const RACE_CONFIRMATION = "RACE_CONFIRMATION";
export const RACE_DISQUALIFICATION = "RACE_DISQUALIFICATION";
export const RACE_GIVE_UP = "RACE_GIVE_UP";
export const DISQUALIFY_PARTICIPANT = "DISQUALIFY_PARTICIPANT";

export enum RaceButton {
  RACE_JOIN = "RACE_JOIN",
  RACE_RESEND_JOIN_FORM = "RACE_RESEND_JOIN_FORM",
  RACE_REVEAL = "RACE_REVEAL",
  RACE_START = "RACE_START",
  RACE_FINISH = "RACE_FINISH",
  RACE_GIVE_UP = "RACE_GIVE_UP",
}
