import React from 'react';
import styled from 'styled-components';
import { MemberBadge, Game } from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useBadges, useMemberBadges } from 'sdk';
import { BadgeTile } from 'containers';
import { Flex, Warning } from 'components';

type Props = { memberId: string };

export const MemberProfileBadges = (props: Props) => {
	const { memberId } = props;

	const { gamesData: games } = useAllGames();
	const { badgesData } = useBadges({ sort: { points: 'desc' } });
	const { memberBadgesData = [] } = useMemberBadges(memberId);

	const hasBadges = memberBadgesData.length > 0;

	const memberBadges = badgesData
		.filter(badge => {
			return memberBadgesData.find(
				(mb: MemberBadge) => mb.badgeId === String(badge._id),
			);
		})
		.map(badge => {
			if (!badge) return;
			const game = games.find((g: Game) => g.id === badge.gameId);
			if (!game || game.isCurated || game.isProtected) {
				return (
					<BadgeTile
						badge={badge}
						isCompact
						key={`member-badge-${String(badge._id)}`}
					/>
				);
			}
		})
		.filter(Boolean);

	return (
		<StyledMemberProfileBadges>
			{hasBadges ? (
				memberBadges
			) : (
				<Warning description="This user has no badges yet!" />
			)}
		</StyledMemberProfileBadges>
	);
};

const StyledMemberProfileBadges = styled(Flex)`
	align-items: flex-start;
	justify-content: center;
	flex-wrap: wrap;
	gap: var(--size-16);
	width: 100%;
`;
