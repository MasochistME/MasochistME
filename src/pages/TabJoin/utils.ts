export const validateSteamName = (steamName?: string) => {
	const error =
		'Please enter an account name that is at least 3 characters long and uses only a-z, A-Z, 0-9 or _ characters.';
	const steamNameValidator = new RegExp(/^[a-zA-Z0-9_]*$/i);
	const hasError =
		!steamName || steamName.length < 3 || !steamNameValidator.test(steamName);
	return { hasError, error };
};
