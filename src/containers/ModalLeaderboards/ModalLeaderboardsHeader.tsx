import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { useCuratedGames } from 'sdk';
import { Flex, Icon, Button } from 'components';
import { Game } from '@masochistme/sdk/dist/v1/types';

type Props = {
	gameId: number;
};

export const ModalLeaderboardsHeader = ({ gameId }: Props) => {
	const navigate = useNavigate();
	const { gamesData } = useCuratedGames();

	const game = gamesData.find((g: Game) => g.id === gameId);

	const onShowGame = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		navigate(`/game/${gameId}`);
		event.stopPropagation();
	};

	return (
		<StyledModalLeaderboardsHeader row align>
			<a
				href={`https://store.steampowered.com/app/${gameId}`}
				target="_blank"
				rel="noopener noreferrer"
				onClick={event => event.stopPropagation()}>
				<Flex align gap={8}>
					<Icon icon="Steam" />
					<h2>{game ? game.title : 'Loading...'}</h2>
				</Flex>
			</a>
			<Button label="Details" icon="CircleInfo" onClick={onShowGame} />
		</StyledModalLeaderboardsHeader>
	);
};

const StyledModalLeaderboardsHeader = styled(Flex)`
	justify-content: space-between;
	h2 {
		margin: 0;
		padding: 0;
	}
`;
