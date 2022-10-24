import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Flex, Button } from 'components';

type Props = {
	gameId: number;
	gameTitle?: string;
};

export const ModalLeaderboardsHeader = (props: Props) => {
	const { gameId, gameTitle = 'Loading...' } = props;
	const history = useHistory();

	const onShowGame = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		history.push(`/game/${gameId}`);
		event.stopPropagation();
	};

	return (
		<StyledModalLeaderboardsHeader row align>
			<h2>
				<a
					href={`https://store.steampowered.com/app/${gameId}`}
					target="_blank"
					rel="noopener noreferrer"
					onClick={event => event.stopPropagation()}>
					<i className="fab fa-steam" /> {gameTitle}
				</a>
			</h2>
			<Button label="Details" icon="fas fa-info-circle" onClick={onShowGame} />
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
