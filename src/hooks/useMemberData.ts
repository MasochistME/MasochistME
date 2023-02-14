import { useCuratorMembers } from 'sdk';

export const useMemberData = (id?: string | null) => {
	const { membersData } = useCuratorMembers();

	const getMember = () => {
		if (!id) return null;
		const member =
			membersData.find(m => m.discordId === id) ||
			membersData.find(m => m.steamId === id);

		return member;
	};

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

	const getMemberAvatar = () => {
		if (!id) return null;
		const avatar = membersData.find(m => m.steamId === id)?.avatar;
		return avatar;
	};

	return {
		getMember,
		getMemberUsername,
		getMemberSteamId,
		getMemberDiscordId,
		getMemberAvatar,
	};
};
