import React from 'react';
import { EventGameAdd, EventType } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useEvents } from 'sdk';
import { Flex } from 'components';
import { Section, GameTile } from 'containers';
import dayjs from 'dayjs';

const NUMBER_OF_GAMES = 3;

export const SectionNewGames = (): JSX.Element => {
	const {
		gamesData,
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();
	const {
		eventsData,
		isLoading: isEventsLoading,
		isFetched: isEventsFetched,
	} = useEvents({
		limit: NUMBER_OF_GAMES,
		sort: { date: 'desc' },
		filter: { type: EventType.GAME_ADD },
	});

	const isLoading = isEventsLoading && isGamesLoading;
	const isFetched = isEventsFetched && isGamesFetched;

	const gameEvents = eventsData.filter(
		event => event.type === EventType.GAME_ADD,
	) as unknown as EventGameAdd[];

	const newestGames = gameEvents.map(event => {
		const game = gamesData.find(game => game.id === event.gameId);
		if (game)
			return (
				<GameTile
					key={`new-game-${game.id}`}
					gameId={game.id}
					title={<div>Curated {dayjs(event.date).fromNow()}</div>}
				/>
			);
	});

	const loadingGames = new Array(NUMBER_OF_GAMES)
		.fill(null)
		.map((_, i: number) => (
			<GameTile key={`new-game-${i}`} isLoading={isLoading} />
		));

	return (
		<Section
			title="Recent curations"
			content={
				<Flex align column flexWrap="wrap" gap="12px">
					{isLoading && loadingGames}
					{isFetched && newestGames}
				</Flex>
			}
		/>
	);
};
