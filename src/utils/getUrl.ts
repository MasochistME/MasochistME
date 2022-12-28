// import { LOGO } from 'shared/consts';

export const getGameThumbnail = (gameId?: number) => {
	if (gameId)
		return `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg`;
	else return '';
	// else return LOGO; // TODO
};

export const getGameSteamUrl = (gameId: number): string => {
	return `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
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
