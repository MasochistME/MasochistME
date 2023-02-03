import React, { useState } from 'react';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useCuratedGames } from 'sdk';
import { getTierIcon, getGameThumbnail } from 'utils';
import { Flex, Icon, Skeleton, Tooltip, Size, QueryBoundary } from 'components';
import { ModalLeaderboards } from 'containers';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	gameId?: number;
	title?: React.ReactNode;
	isLoading?: boolean;
};

export const GameTile = (props: Props) => {
	const { gameId, title, isLoading } = props;
	const { colorTokens } = useTheme();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const onShowModal = () => {
		if (gameId) setIsModalOpen(!isModalOpen);
	};

	if (isLoading) return <Skeleton width={300} height={145} />;
	return (
		<Tooltip content={title}>
			<StyledGameTile
				column
				align
				justify
				onClick={onShowModal}
				colorTokens={colorTokens}>
				<QueryBoundary fallback={null}>
					<GameThumbnail gameId={gameId} />
				</QueryBoundary>
				{gameId && (
					<ModalLeaderboards
						gameId={gameId}
						isModalOpen={isModalOpen}
						setIsModalOpen={setIsModalOpen}
						isCompact
					/>
				)}
			</StyledGameTile>
		</Tooltip>
	);
};

const GameThumbnail = ({ gameId }: Pick<Props, 'gameId'>) => {
	const { tiersData } = useTiers();
	const { gamesData } = useCuratedGames();
	const { colorTokens } = useTheme();

	const game = gamesData.find((g: Game) => g.id === gameId);

	if (!game) return null;
	return (
		<StyledGameThumbnail
			className={`game-tier-${game.tier}`}
			src={getGameThumbnail(game.id)}>
			<StyledGameHiddenInfo column align colorTokens={colorTokens}>
				<Icon icon={getTierIcon(game.tier, tiersData)} size={Size.MICRO} />
				<h3>{game.title}</h3>
				<p style={{ margin: '0', fontSize: '0.85em' }}>{game.description}</p>
			</StyledGameHiddenInfo>
		</StyledGameThumbnail>
	);
};

const StyledGameTile = styled(Flex)<{ colorTokens: ColorTokens }>`
	width: 300px;
	height: 145px;
	border: 3px solid ${({ colorTokens }) => colorTokens['core-tertiary-bg']};
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

const StyledGameHiddenInfo = styled(Flex)<{ colorTokens: ColorTokens }>`
	width: 100%;
	height: 100%;
	padding: 4px;
	box-sizing: border-box;
	justify-content: space-around;
	overflow: hidden;
	opacity: 0;
	background-color: rgba(0, 0, 0, 0);
	color: ${({ colorTokens }) => colorTokens['core-tertiary-text']};
	transition: background-color linear 0.4s, opacity 0.3s;

	text-align: center;

	&:hover {
		opacity: 1;
		background-color: ${({ colorTokens }) => colorTokens['core-tertiary-bg']}bb;
	}
`;
