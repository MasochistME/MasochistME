import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames } from 'sdk';
import { colors, fonts } from 'shared/theme';
import { Flex } from 'components';
import { GameLeaderboards } from 'containers';

import { ModalLeaderboardsBadges } from './ModalLeaderboardsBadges';
import { ModalLeaderboardsHeader } from './ModalLeaderboardsHeader';

type Props = {
	gameId: number;
	isModalOpen: boolean;
	isCompact?: boolean;
};

export const ModalLeaderboards = (props: Props): JSX.Element | null => {
	const { gameId, isModalOpen, isCompact } = props;

	const { gamesData, isFetched: isGameLoaded } = useCuratedGames();
	const game = gamesData.find((g: Game) => g.id === gameId);

	return (
		<Modal isOpen={isModalOpen} style={{ ...modalStyle }}>
			<WrapperLeaderboards column>
				{isGameLoaded && game && (
					<>
						<Flex column gap={16} padding="16px">
							<ModalLeaderboardsHeader
								gameId={gameId}
								gameTitle={game?.title}
							/>
							<ModalLeaderboardsBadges gameId={gameId} isCompact />
						</Flex>
						<GameLeaderboards gameId={gameId} isCompact={isCompact} />
					</>
				)}
			</WrapperLeaderboards>
		</Modal>
	);
};

export const WrapperLeaderboards = styled(Flex)`
	box-sizing: border-box;
	text-align: center;
	width: 100%;
	width: 700px;
	max-width: 90%;
	height: auto;
	max-height: 90%;
	gap: 16px;
	overflow-y: auto;
	background-color: ${colors.darkBlueTransparent};
	color: ${colors.superLightGrey};
	font-family: ${fonts.Raleway};
`;

const modalStyle = {
	overlay: {
		zIndex: '9999',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: `${colors.newDark}cc`,
		width: '100vw',
		height: '100vh',
	},
	content: {
		backgroundColor: '#00000000',
		border: 'none',
		inset: 0,
		padding: 0,
		borderRadius: 0,
		width: '100%',
		height: '100%',
		// boxSizing: 'border-box',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
};
