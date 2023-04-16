import { Badge } from '@masochistme/sdk/dist/v1/types';

export const curatorURL = 'https://store.steampowered.com/curator/41289936';

export const getGameThumbnail = (gameId?: number) => {
	if (gameId)
		return `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg`;
	else return 'http://cdn.masochist.me/files/no_game_img.png';
};

export const getBadgeThumbnail = (badge?: Badge) => {
	if (badge?.img) return badge.img;
	else return 'http://cdn.masochist.me/files/no_game_img.png';
};

export const getGameSteamUrl = (gameId: number): string => {
	return `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
};

export const getUserSteamUrl = (steamId: string): string => {
	return `http://steamcommunity.com/profiles/${steamId}`;
};

export const getAvatarFromHash = (
	avatarHash: string,
	size: 'full' | 'medium' = 'full',
): string => {
	return `https://avatars.akamai.steamstatic.com/${avatarHash}_${size}.jpg`;
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
