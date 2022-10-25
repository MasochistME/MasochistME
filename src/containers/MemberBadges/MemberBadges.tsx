import React from 'react';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useMemberBadges, useBadges } from 'sdk';
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
	const { badgesData } = useBadges();

	const badges = badgesData.filter(
		(badge: Badge) =>
			badge.gameId === gameId &&
			memberBadgesData.find(b => b.badgeId === String(badge._id)),
	);

	const mappedBadges = badges.map((badge: Badge, i: number) => {
		return (
			<BadgeThumbnail
				size={size}
				badge={badge}
				disabled={i % 2 === 0}
				key={`badge-tile-${badge._id}`}
			/>
		);
	});

	return <Flex gap={4}>{mappedBadges}</Flex>;
};
