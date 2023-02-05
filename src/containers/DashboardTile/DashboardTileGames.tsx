import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { EventGameAdd, EventType } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useEvents } from 'sdk';
import { Section, SectionProps, GameTile } from 'containers';
import { Flex, ErrorFallback, QueryBoundary } from 'components';

const NUMBER_OF_GAMES = 3;

type Props = Omit<SectionProps, 'content' | 'title'>;
export const DashboardTileGames = (props: Props): JSX.Element => {
	const games = new Array(NUMBER_OF_GAMES)
		.fill(null)
		.map((_, i: number) => <GameTile key={`game-new-${i}`} isLoading />);

	return (
		<QueryBoundary
			fallback={<Content content={games} />}
			errorFallback={<Content content={<ErrorFallback />} />}>
			<DashboardTileGamesBoundary {...props} />
		</QueryBoundary>
	);
};

const DashboardTileGamesBoundary = (props: Props): JSX.Element => {
	const { gamesData } = useCuratedGames();
	const { eventsData } = useEvents({
		limit: NUMBER_OF_GAMES,
		sort: { date: 'desc' },
		filter: { type: EventType.GAME_ADD },
	});

	const gameEvents = eventsData.filter(
		event => event.type === EventType.GAME_ADD,
	) as unknown as EventGameAdd[];

	const games = gameEvents.map(event => {
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

	return <Content content={games} {...props} />;
};

type ContentProps = Props & { content: React.ReactNode };
const Content = ({ content, ...props }: ContentProps) => (
	<Section
		title="Recent curations"
		maxWidth="100%"
		content={<StyledNewGammes>{content}</StyledNewGammes>}
		{...props}
	/>
);

const StyledNewGammes = styled(Flex)`
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-evenly;
	gap: 16px;
`;
