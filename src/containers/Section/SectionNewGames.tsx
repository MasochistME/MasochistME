import React from 'react';
import { Event, EventGameAdd, EventType } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useEvents } from 'sdk';
import { Flex } from 'components';
import { Section } from 'containers';
import { GameTile } from 'pages/TabGames/GameTile';

export const SectionNewGames = (): JSX.Element => {
	const { gamesData } = useCuratedGames();
	const { eventsData } = useEvents({
		limit: 5,
		sort: { date: 'desc' },
		filter: { type: EventType.GAME_ADD },
	});

	const gameEvents = eventsData
		.filter(event => event.type === EventType.GAME_ADD)
		.sort(
			(eventA: Event, eventB: Event) =>
				new Date(eventA.date).getTime() - new Date(eventB.date).getTime(),
		) as unknown as EventGameAdd[];

	const newestGames = gameEvents.map(event => {
		const game = gamesData.find(game => game.id === event.gameId);
		if (game) return <GameTile gameId={game.id} />;
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
