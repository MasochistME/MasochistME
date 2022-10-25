import React from 'react';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useMemberBadges, useGameBadges } from 'sdk';
import { BadgeThumbnail } from 'containers';
import { Flex } from 'components';
import { Size } from 'utils';

type Props = {
	size?: Size;
	memberId: string;
	gameId: number;
};

export const MemberBadges = (props: Props): JSX.Element => {
	const { size = Size.MEDIUM, memberId, gameId } = props;

	const { memberBadgesData } = useMemberBadges(memberId);
	const { gameBadgesData } = useGameBadges(gameId);

	const mappedBadges = gameBadgesData.map((badge: Badge) => {
		const memberHasBadge = !!memberBadgesData.find(
			b => b.badgeId === String(badge._id),
		);
		return (
			<BadgeThumbnail
				size={size}
				badge={badge}
				disabled={!memberHasBadge}
				key={`badge-tile-${badge._id}`}
			/>
		);
	});

	return <Flex gap={4}>{mappedBadges}</Flex>;
};
