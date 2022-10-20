import React from 'react';
import { EventGameAdd, EventType } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useEvents } from 'sdk';
import { Flex } from 'components';
import { Section } from 'containers';
import { GameTile } from 'pages/TabGames/GameTile';
import dayjs from 'dayjs';

export const SectionNewGames = (): JSX.Element => {
	const { gamesData } = useCuratedGames();
	const { eventsData } = useEvents({
		limit: 3,
		sort: { date: 'desc' },
		filter: { type: EventType.GAME_ADD },
	});

	const gameEvents = eventsData.filter(
		event => event.type === EventType.GAME_ADD,
	) as unknown as EventGameAdd[];

	const newestGames = gameEvents.map(event => {
		const game = gamesData.find(game => game.id === event.gameId);
		if (game)
			return (
				<GameTile
					gameId={game.id}
					title={<div>Curated {dayjs(event.date).fromNow()}</div>}
				/>
			);
	});

	return (
		<Section
			// fullWidth
			title="Recent curations"
			content={
				<Flex align column flexWrap="wrap" gap="8px">
					{newestGames}
				</Flex>
			}
		/>
	);
};
