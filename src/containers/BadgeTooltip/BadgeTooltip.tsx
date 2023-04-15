import React from 'react';
import styled from 'styled-components';

import { useCuratedGames } from 'sdk';
import { Flex, Tooltip } from 'components';
import { Badge, Game } from '@masochistme/sdk/dist/v1/types';

type Props = {
	badge?: Badge;
	children: React.ReactElement;
};

export const BadgeTooltip = (props: Props) => {
	const { badge, children } = props;

	const { gamesData } = useCuratedGames();
	const game = gamesData.find((g: Game) => g.id === badge?.gameId);
	const gameTitle = (
		game?.title ??
		badge?.title ??
		'UNKNOWN GAME'
	).toUpperCase();

	return (
		<Tooltip
			content={
				badge ? (
					<StyledTooltip column>
						<div style={{ gap: 'var(--size-4)' }}>
							<span style={{ fontWeight: 'bold' }}>{gameTitle}</span>
							<span> - </span>
							<span>
								{badge.name} ({badge.points} pts)
							</span>
						</div>
						<div style={{ maxWidth: '25rem', fontStyle: 'italic' }}>
							{badge.description}
						</div>
					</StyledTooltip>
				) : null
			}>
			{children}
		</Tooltip>
	);
};

const StyledTooltip = styled(Flex)`
	text-align: left;
`;
