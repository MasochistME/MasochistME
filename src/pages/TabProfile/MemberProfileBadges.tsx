import React from 'react';
import { MemberBadge, Badge, Game } from '@masochistme/sdk/dist/v1/types';

import { useAllGames, useBadges, useMemberBadges } from 'sdk';
import { BadgeTile } from 'containers';
import { Flex } from 'components';
import { orderBy } from 'lodash';

type Props = { memberId: string };

export const MemberProfileBadges = (props: Props) => {
	const { memberId } = props;

	const { gamesData: games } = useAllGames();
	const { badgesData } = useBadges({ sort: { points: 'desc' } });
	const { memberBadgesData = [] } = useMemberBadges(memberId);

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
					<BadgeTile badge={badge} key={`member-badge-${String(badge._id)}`} />
				);
			}
		})
		.filter(Boolean);

	return (
		<Flex align justify flexWrap="wrap" gap={16}>
			{memberBadges}
		</Flex>
	);
};
