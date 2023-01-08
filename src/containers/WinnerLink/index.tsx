import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useMemberData } from 'hooks';

type Props = {
	discordId?: string | null;
	isCompact?: boolean;
};
export const WinnerLink = (props: Props) => {
	const { discordId, isCompact = false } = props;
	const { getMemberUsername, getMemberSteamId } = useMemberData(discordId);
	const steamId = getMemberSteamId();
	const username = getMemberUsername();

	if (!username) return <h4>—</h4>;
	if (username && !steamId) return <h4>{username}</h4>;
	return (
		<StyledWinnerLink to={`/profile/${steamId}`} isCompact={isCompact}>
			<h4>{username}</h4>
		</StyledWinnerLink>
	);
};

const StyledWinnerLink = styled(Link)<{ isCompact: boolean }>`
	h4 {
		margin: ${({ isCompact }) => (isCompact ? 0 : '8px 0')};
	}
`;
