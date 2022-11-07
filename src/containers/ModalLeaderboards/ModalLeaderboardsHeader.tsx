import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';

import { Flex, Icon, Button } from 'components';

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
			<Link
				to={`https://store.steampowered.com/app/${gameId}`}
				target="_blank"
				rel="noopener noreferrer"
				onClick={event => event.stopPropagation()}>
				<Flex align gap={8}>
					<Icon icon="Steam" /> <h2>{gameTitle}</h2>
				</Flex>
			</Link>
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
