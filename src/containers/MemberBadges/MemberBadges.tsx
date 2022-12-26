import React from 'react';

import { useMemberBadges, useBadges } from 'sdk';
import { BadgeThumbnail } from 'containers';
import { Flex } from 'components';
import { Size } from 'components';

type Props = {
	size?: Size;
	memberId: string;
	gameId: number;
};

export const MemberBadges = (props: Props): JSX.Element => {
	const { size = Size.MEDIUM, memberId, gameId } = props;

	const { memberBadgesData } = useMemberBadges(memberId);
	const { badgesData } = useBadges();

	const mappedBadges = badgesData
		.filter(badge => badge.gameId === gameId)
		.map(badge => {
			const memberHasBadge = !!memberBadgesData.find(
				b => b.badgeId === String(badge._id),
			);
			const isBadgeNegative = badge.points < 0;
			if (isBadgeNegative && !memberHasBadge) return null;
			return (
				<BadgeThumbnail
					size={size}
					badge={badge}
					isDisabled={!memberHasBadge}
					key={`badge-tile-${badge._id}`}
				/>
			);
		});

	return <Flex gap={4}>{mappedBadges}</Flex>;
};
