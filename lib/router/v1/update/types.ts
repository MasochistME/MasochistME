/**
 * Steam API with the info about member.
 * Endpoint: https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2
 */
export type MemberSteam = {
  steamid: string;
  communityvisibilitystate: 1 | 3; // 1 is private, 3 is public
  profilestate: number;
  personaname: string;
  commentpermission: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string; //'6c5dd47485cac63bca435d3e0bb2e08464191df7'; // this can be inserted into url
  lastlogoff: number;
  personastate: number;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
};

/**
 * Steam API with the info about member's games.
 * Endpoint: http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/
 */
export type MemberSteamGame = {
  appid: number;
  playtime_forever: number; // this is in minutes
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  rtime_last_played: number; // timestamp?
};

/**
 * Scrapped Steam HTML page with the info about member's games.
 * Endpoint: https://steamcommunity.com/profiles/:memberId/games/?tab=all
 */
export type MemberSteamGameFallback = {
  appid: number;
  name: string;
  app_type: number; // dunno what this is - it was 1 for Killing Floor
  logo: string;
  friendlyURL: string; // game's name that's in URL, for example 'KillingFloor'
  availStatLinks: {
    achievements: boolean;
    global_achievements: boolean;
    stats: boolean;
    gcpd: boolean;
    leaderboards: boolean;
    global_leaderboards: boolean;
  };
  hours_forever: string; // stringified amount of hours played
  last_played: number; // timestamp
};

/**
 * Data about specified players' games.
 * Endpoint: http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1
 */
export type MemberSteamPlayerStats = {
  playerstats: {
    steamID: string; // Steam ID of the member
    gameName: string; // name of the game
    achievements: MemberSteamAchievement[]; // list of game achievements
    success: boolean;
  };
};

/**
 * Data about achievements in a specified player's game.
 * Endpoint: http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1
 */
export type MemberSteamAchievement = {
  apiname: string; // Steam API name of the achievement
  achieved: 0 | 1; // If the member unlocked this achievement
  unlocktime: number; // Timestamp in seconds
};

/**
 * Detailed data about a Steam game.
 * Endpoint: http://store.steampowered.com/api/appdetails,
 * params: {
 *  appids,
 *  filters: 'price_overview,basic,achievements',
 * }
 */
export type SteamGameDetails = {
  [key: string]: {
    success: boolean;
    data: SteamGameDetailsData;
  };
};

export type SteamGameDetailsData = {
  type: string; // 'game' for games
  name: string;
  steam_appid: number;
  required_age: number; // 0 if no restrictions
  is_free: boolean;
  controller_support: string;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string; // URL of the avatar
  website: string | null;
  pc_requirements: { minimum: string; recommended: string };
  mac_requirements: { minimum: string; recommended: string };
  linux_requirements: { minimum: string; recommended: string };
  price_overview: SteamGameDetailsPrice;
  achievements: SteamGameDetailsAchievements;
};

export type SteamGameDetailsPrice = {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
};

export type SteamGameDetailsAchievements = {
  total: number;
  highlighted: { name: string; path: string }[];
};
