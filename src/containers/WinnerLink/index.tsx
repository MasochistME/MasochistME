import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useRaceById } from 'sdk';
import { useMemberData } from 'hooks';
import { Icon } from 'components';

type Props = {
	discordId?: string | null;
	raceId?: string | null;
	isCompact?: boolean;
};
export const WinnerLink = (props: Props) => {
	const { discordId, raceId, isCompact = false } = props;
	const { getMemberUsername, getMemberSteamId } = useMemberData(discordId);
	const { raceData: race } = useRaceById(raceId);

	const steamId = getMemberSteamId();
	const username = getMemberUsername();

	if (username && !steamId) return <h4>{username}</h4>;
	return (
		<StyledWinnerLink to={`/profile/${steamId}`} isCompact={isCompact}>
			<h4>{username ?? '—'}</h4>
			{race?.owner === discordId && (
				<Icon icon="Crown" hoverText="This member is an owner of this race." />
			)}
		</StyledWinnerLink>
	);
};

const StyledWinnerLink = styled(Link)<{ isCompact: boolean }>`
	display: flex;
	align-items: center;
	gap: 4px;
	h4 {
		margin: ${({ isCompact }) => (isCompact ? 0 : '8px 0')};
	}
`;
