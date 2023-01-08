import { useCuratorMembers } from 'sdk';

export const useMemberData = (id?: string | null) => {
	const { membersData } = useCuratorMembers();

	const getMemberUsername = () => {
		if (!id) return null;
		const usernameByDiscordId = membersData.find(m => m.discordId === id)?.name;
		const usernameBySteamId = membersData.find(m => m.steamId === id)?.name;

		return usernameBySteamId ?? usernameByDiscordId;
	};

	const getMemberSteamId = () => {
		if (!id) return null;
		const steamId = membersData.find(m => m.discordId === id)?.steamId;
		return steamId;
	};

	const getMemberDiscordId = () => {
		if (!id) return null;
		const discordId = membersData.find(m => m.steamId === id)?.discordId;
		return discordId;
	};

	return { getMemberUsername, getMemberSteamId, getMemberDiscordId };
};
