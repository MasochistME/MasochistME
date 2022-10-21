import React, { useState } from 'react';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { getTierIcon, getGameThumbnail } from 'utils';
import { useTiers, useCuratedGames } from 'sdk';
import { colors } from 'shared/theme';
import { Flex, Skeleton, Tooltip } from 'components';

import { GameTileModal } from './GameTileModal';

type Props = {
	gameId?: number;
	title?: React.ReactNode;
	isLoading?: boolean;
};

export const GameTile = (props: Props): JSX.Element => {
	const { gameId, title, isLoading } = props;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		tiersData,
		isLoading: isTiersLoading,
		isFetched: isTiersFetched,
	} = useTiers();
	const {
		gamesData,
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();

	const game = gamesData.find((g: Game) => g.id === gameId);

	const isDataLoading = isTiersLoading && isGamesLoading;
	const isDataFetched = isGamesFetched && isTiersFetched;

	const onShowModal = () => {
		if (gameId) setIsModalOpen(!isModalOpen);
	};

	return (
		<Tooltip content={title}>
			<StyledGameTile column align justify onClick={onShowModal}>
				{game &&
					(isDataLoading && isLoading ? (
						<Skeleton width={300} height={145} />
					) : (
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
					))}
				{gameId && (
					<GameTileModal
						gameId={gameId}
						isOpen={isModalOpen}
						setIsOpen={setIsModalOpen}
					/>
				)}
			</StyledGameTile>
		</Tooltip>
	);
};

const StyledGameTile = styled(Flex)`
	width: 300px;
	height: 145px;
	border: 3px solid ${colors.black};
	box-sizing: border-box;
`;

const StyledGameThumbnail = styled.div.attrs(({ src }: { src: string }) => {
	return {
		style: {
			backgroundImage: `url(${src})`,
		},
	};
})<{ src: string }>`
	width: 100%;
	height: 100%;
	background-size: 300px;
	background-position: center;
	background-repeat: no-repeat;

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
	color: ${colors.white};
	transition: background-color linear 0.4s, opacity 0.3s;

	text-align: center;

	&:hover {
		opacity: 1;
		background-color: ${colors.black}bb;
	}
`;
