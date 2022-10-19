import React, { useState } from 'react';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { getTierIcon, getGameThumbnail } from 'utils';
import { useTiers, useCuratedGames } from 'sdk';
import { colors } from 'shared/theme';
import { Flex, Spinner } from 'components';

import { GameTileModal } from './GameTileModal';

type Props = {
	gameId: number;
};

export const GameTile = (props: Props): JSX.Element => {
	const { gameId } = props;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { tiersData } = useTiers();
	const { gamesData } = useCuratedGames();

	const game = gamesData.find((g: Game) => g.id === gameId);

	const onShowModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<StyledGameTile column align justify onClick={onShowModal}>
			{!game && <Spinner />}
			{game && (
				<StyledGameThumbnail
					className={`game-tier-${game.tier}`}
					src={getGameThumbnail(game.id)}>
					<StyledGameHiddenInfo column align>
						<i className={getTierIcon(game.tier, tiersData)} />
						<h3>{game.title}</h3>
						<p style={{ margin: '0', fontSize: '0.85em' }}>
							{game.description}
						</p>
					</StyledGameHiddenInfo>
				</StyledGameThumbnail>
			)}
			<GameTileModal
				gameId={gameId}
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
			/>
		</StyledGameTile>
	);
};

const StyledGameTile = styled(Flex)`
	background-color: ${colors.newDark}dd;
`;

const StyledGameThumbnail = styled.div<{ src: string }>`
	width: 300px;
	height: 145px;
	background-size: 300px;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url(${({ src }) => src});
	border: 3px solid ${colors.black};
	box-sizing: border-box;
	cursor: pointer;
	transition: background-size ease-out 0.4s;
	&:hover {
		background-size: 400px;
	}
`;

const StyledGameHiddenInfo = styled(Flex)`
	width: 100%;
	height: 100%;
	padding: 4px;
	box-sizing: border-box;
	justify-content: space-around;
	overflow: hidden;
	opacity: 0;
	background-color: rgba(0, 0, 0, 0);
	color: ${colors.superLightGrey};
	transition: background-color linear 0.4s, opacity 0.3s;
	&:hover {
		opacity: 1;
		background-color: ${colors.black}dd;
	}
`;
