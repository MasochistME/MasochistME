import React from 'react';

import { useMemberBadges, useBadges } from 'sdk';
import { BadgeThumbnail } from 'containers';
import { Flex, QueryBoundary, Spinner } from 'components';
import { Size } from 'components';

type Props = {
	size?: Size;
	memberId?: string;
	gameId?: number;
};

export const MemberBadges = (props: Props) => {
	const { memberId, gameId, size = Size.MEDIUM } = props;
	if (!memberId || !gameId) return null;
	return (
		<QueryBoundary fallback={<Spinner size={Size.TINY} />}>
			<MemberBadgesBoundary memberId={memberId} gameId={gameId} size={size} />
		</QueryBoundary>
	);
};

const MemberBadgesBoundary = (props: Required<Props>) => {
	const { size, memberId, gameId } = props;

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
