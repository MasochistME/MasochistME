import { Award, Badge } from '@masochistme/sdk/dist/v1/types';

export const curatorURL = 'https://store.steampowered.com/curator/41289936';
export const NO_IMG = 'https://cdn.masochist.me/files/no_game_img.png';

export const getGameThumbnail = (gameId?: number) => {
  if (gameId)
    return `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg`;
  else return NO_IMG;
};

export const getBadgeThumbnail = (badge?: Badge) => {
  if (badge?.img) return badge.img;
  else return NO_IMG;
};

export const getAwardThumbnail = (award?: Award) => {
  if (award?.img) return award.img;
  else return NO_IMG;
};

export const getGameSteamUrl = (gameId: number): string => {
  return `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
};

export const getUserSteamUrl = (steamId: string): string => {
  return `http://steamcommunity.com/profiles/${steamId}`;
};

export const getAvatarFromHash = (
  avatarHash: string,
  size: '_full' | '_medium' | '',
): string => {
  return `https://avatars.akamai.steamstatic.com/${avatarHash}${size}.jpg`;
};

export const getYTVideoID = (link?: string) => {
  if (!link) return null;

  // // Lookbehind is not supported on Safari :(
  // const ytLinkRegex = [
  // 	new RegExp(/(?<=youtu.be\/)(.*)/gim),
  // 	new RegExp(/(?<=youtube.com\/watch\?v=)(.*)/gim),
  // ];
  const ytLinkId = link
    .replace(/(.*youtube\.com\/watch\?v=.*?)/, '')
    .replace(/(.*youtu.be\/.*?)/, '')
    .split('&')[0]; // params like t= or channel= aren't supported by embed, remove
  return ytLinkId;
};
