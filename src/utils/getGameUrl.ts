import logo from 'shared/images/logo.png';

export const getGameThumbnail = (gameId?: number) => {
	if (gameId)
		return `https://cdn.akamai.steamstatic.com/steam/apps/${gameId}/header.jpg`;
	else return logo;
};

export const getGameSteamUrl = (gameId: number): string => {
	return `http://store.steampowered.com/api/appdetails?appids=${gameId}`;
};
