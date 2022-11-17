import React from 'react';
import styled from 'styled-components';
import { Box, Modal } from '@mui/material';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames } from 'sdk';
import { fonts, useTheme, ColorTokens } from 'styles';
import { Flex } from 'components';
import { GameLeaderboards } from 'containers';

import { ModalLeaderboardsBadges } from './ModalLeaderboardsBadges';
import { ModalLeaderboardsHeader } from './ModalLeaderboardsHeader';

type Props = {
	gameId: number;
	isCompact?: boolean;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
};

export const ModalLeaderboards = (props: Props): JSX.Element | null => {
	const { gameId, isCompact, isModalOpen, setIsModalOpen } = props;
	const { colorTokens } = useTheme();
	const { gamesData, isFetched: isGameLoaded } = useCuratedGames();
	const game = gamesData.find((g: Game) => g.id === gameId);

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const modalStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		maxWidth: '90%',
		maxHeight: '90%',
		overflowY: 'auto',
		border: `1px solid ${colorTokens['core-extra-bg']}`,
		boxShadow: `0 0 10px ${colorTokens['common-color--black']}aa`,
	};

	return (
		<Modal open={isModalOpen} onClose={handleModalClose}>
			<Box sx={modalStyle}>
				<WrapperLeaderboards column colorTokens={colorTokens}>
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
			</Box>
		</Modal>
	);
};

export const WrapperLeaderboards = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	text-align: center;
	width: 700px;
	max-width: 100%;
	height: auto;
	gap: 16px;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: ${fonts.Raleway};
`;
