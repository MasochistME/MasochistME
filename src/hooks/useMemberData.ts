import { useCallback } from 'react';
import { useCuratorMembers } from 'sdk';

export const useMemberData = (id?: string | null) => {
	const { membersData } = useCuratorMembers();

	const getMemberUsername = useCallback(() => {
		if (!id) return null;
		const usernameByDiscordId = membersData.find(m => m.discordId === id)?.name;
		const usernameBySteamId = membersData.find(m => m.steamId === id)?.name;

		return usernameBySteamId ?? usernameByDiscordId;
	}, [membersData]);

	const getMemberSteamId = useCallback(() => {
		if (!id) return null;
		const steamId = membersData.find(m => m.discordId === id)?.steamId;
		return steamId;
	}, [membersData]);

	const getMemberDiscordId = useCallback(() => {
		if (!id) return null;
		const discordId = membersData.find(m => m.steamId === id)?.discordId;
		return discordId;
	}, [membersData]);

	return { getMemberUsername, getMemberSteamId, getMemberDiscordId };
};
