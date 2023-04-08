import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { LogGameAdd, LogType } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useLogs } from 'sdk';
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
	const { data: logs = [] } = useLogs({
		limit: NUMBER_OF_GAMES,
		sort: { date: 'desc' },
		filter: { type: LogType.GAME_ADD },
	});

	const gameLogs = logs.filter(
		log => log.type === LogType.GAME_ADD,
	) as unknown as LogGameAdd[];

	const games = gameLogs.map(log => {
		const game = gamesData.find(game => game.id === log.gameId);
		if (game)
			return (
				<GameTile
					key={`new-game-${game.id}`}
					gameId={game.id}
					title={<div>Curated {dayjs(log.date).fromNow()}</div>}
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
	gap: var(--size-16);
`;
