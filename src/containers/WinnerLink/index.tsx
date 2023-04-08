import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useRaceById } from 'sdk';
import { useMemberData } from 'hooks';
import { Icon } from 'components';
import { MemberAvatar } from 'containers/MemberAvatar';

type Props = {
	discordId?: string | null;
	raceId?: string | null;
	isCompact?: boolean;
	hasAvatar?: boolean;
};
export const WinnerLink = (props: Props) => {
	const { discordId, raceId, isCompact = false, hasAvatar = false } = props;
	const { getMember, getMemberUsername, getMemberSteamId } =
		useMemberData(discordId);
	const { raceData: race } = useRaceById(raceId);

	const member = getMember();
	const steamId = getMemberSteamId();
	const username = getMemberUsername();

	if (!member) return null;
	if (username && !steamId) return <h4>{username}</h4>;
	return (
		<StyledWinnerLink to={`/profile/${steamId}`} isCompact={isCompact}>
			{hasAvatar && <MemberAvatar member={member} />}
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
	justify-content: flex-start;
	gap: var(--size-4);
	h4 {
		margin: ${({ isCompact }) => (isCompact ? 0 : 'var(--size-8) 0')};
	}
`;
