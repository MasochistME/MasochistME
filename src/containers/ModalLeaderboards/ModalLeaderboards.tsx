import React from 'react';
import { useHistory } from 'react-router-dom';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { Flex, Spinner, CustomButton } from 'components';
import { useCuratedGames } from 'sdk';

import { WrapperLeaderboards } from './components';
import { List } from './List';
import { Badges } from './Badges';

type Props = {
	gameId: number;
	compact?: boolean;
};

export const ModalLeaderboards = (props: Props): JSX.Element | null => {
	const { gameId, compact } = props;
	const history = useHistory();

	const { gamesData, isFetched: isGameLoaded } = useCuratedGames();

	const game = gamesData.find((g: Game) => g.id === gameId);

	const onShowGame = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		history.push(`/game/${gameId}`);
		event.stopPropagation();
	};

	return (
		<WrapperLeaderboards>
			<Flex
				row
				align
				style={{
					justifyContent: 'space-between',
					borderBottom: '1px solid #444',
					marginBottom: '12px',
				}}>
				<h2 style={{ borderBottom: 0 }}>
					<a
						href={`https://store.steampowered.com/app/${game?.id ?? ''}`}
						target="_blank"
						rel="noopener noreferrer"
						onClick={event => event.stopPropagation()}>
						<i className="fab fa-steam" /> {game?.title ?? 'Loading...'}
					</a>
				</h2>
				<CustomButton onClick={onShowGame}>Details</CustomButton>
			</Flex>
			{isGameLoaded && game ? (
				<Flex column>
					<Badges gameId={gameId} isCompact />
					<List game={game} compact={compact} />
				</Flex>
			) : (
				<Spinner />
			)}
		</WrapperLeaderboards>
	);
};
