import { Link } from 'react-router-dom';
import { useMemberData } from 'hooks';

export const WinnerLink = ({ discordId }: { discordId?: string | null }) => {
	const { getMemberUsername, getMemberSteamId } = useMemberData(discordId);
	const steamId = getMemberSteamId();
	const username = getMemberUsername();

	if (!username) return <h4>—</h4>;
	if (username && !steamId) return <h4>{username}</h4>;
	return (
		<Link to={`/profile/${steamId}`}>
			<h4>{username}</h4>
		</Link>
	);
};
