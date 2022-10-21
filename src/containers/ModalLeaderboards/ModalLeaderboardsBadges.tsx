import React from 'react';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useGameBadges } from 'sdk';
import { BadgeTile, BadgeThumbnail, Section } from 'containers';

type Props = {
	gameId: number;
	isCompact?: boolean;
};

export const ModalLeaderboardsBadges = (props: Props): JSX.Element | null => {
	const { gameId, isCompact = false } = props;

	const { gameBadgesData: badges, isFetched: isBadgeListLoaded } =
		useGameBadges(gameId);

	if (!isBadgeListLoaded || !badges?.length) return null;

	return (
		<Section
			minWidth="400px"
			title="Badges"
			content={
				<>
					{badges.map((badge: Badge) => {
						if (!isCompact)
							return <BadgeTile badge={badge} key={`badge-${badge._id}`} />;
						return (
							<BadgeThumbnail
								badge={badge}
								key={`badge-${String(badge._id)}`}
							/>
						);
					})}
				</>
			}
		/>
	);
};
