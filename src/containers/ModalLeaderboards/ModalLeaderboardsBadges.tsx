import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { useGameBadges } from 'sdk';
import { Flex } from 'components';
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
			margin={'8px'}
			content={
				<StyledModalLeaderboardsBadges justify>
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
				</StyledModalLeaderboardsBadges>
			}
		/>
	);
};

const StyledModalLeaderboardsBadges = styled(Flex)`
	gap: 8px;
	width: 100%;
	flex-flow: row wrap;
`;
