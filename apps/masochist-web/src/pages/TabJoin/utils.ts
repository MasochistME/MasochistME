export const validateSteamUrl = (steamUrl?: string) => {
	const error =
		'Steam profile URL must match the format https://steamcommunity.com/id/* OR https://steamcommunity.com/profiles/*';
	const steamUrlWithIdValidator = new RegExp(
		/^https:\/\/steamcommunity\.com\/profiles\/[0-9]*[\/]?$/i,
	);
	const steamUrlWithNameValidator = new RegExp(
		/^https:\/\/steamcommunity\.com\/id\/[a-zA-Z0-9_]*[\/]?$/i,
	);
	const hasError =
		!steamUrl ||
		(!steamUrlWithIdValidator.test(steamUrl) &&
			!steamUrlWithNameValidator.test(steamUrl));
	return { hasError, error };
};
