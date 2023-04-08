import React from 'react';
import styled from 'styled-components';
import { Box, Modal } from '@mui/material';

import { useTheme, ColorTokens } from 'styles';
import { Flex, Loader, QueryBoundary } from 'components';
import { GameLeaderboards } from 'containers';

import { ModalLeaderboardsBadges } from './ModalLeaderboardsBadges';
import { ModalLeaderboardsHeader } from './ModalLeaderboardsHeader';

type Props = {
	gameId: number;
	isCompact?: boolean;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
};

export const ModalLeaderboards = (props: Props) => {
	const { isModalOpen, setIsModalOpen, ...rest } = props;
	const { colorTokens } = useTheme();

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
		border: `var(--size-1) solid ${colorTokens['core-extra-bg']}`,
		boxShadow: `0 0 var(--size-10) ${colorTokens['common-color--black']}aa`,
	};

	return (
		<Modal open={isModalOpen} onClose={handleModalClose}>
			<Box sx={modalStyle}>
				<WrapperLeaderboards column colorTokens={colorTokens}>
					<QueryBoundary fallback={<Loader />}>
						<ModalLeaderboardsBoundary {...rest} />
					</QueryBoundary>
				</WrapperLeaderboards>
			</Box>
		</Modal>
	);
};

const ModalLeaderboardsBoundary = (
	props: Pick<Props, 'gameId' | 'isCompact'>,
) => {
	const { gameId, isCompact } = props;

	return (
		<>
			<Flex column gap={16} padding="var(--size-16)">
				<ModalLeaderboardsHeader gameId={gameId} />
				<ModalLeaderboardsBadges gameId={gameId} isCompact={isCompact} />
			</Flex>
			<GameLeaderboards gameId={gameId} isCompact={isCompact} />
		</>
	);
};

export const WrapperLeaderboards = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	text-align: center;
	width: 70rem;
	max-width: 100%;
	height: auto;
	gap: var(--size-16);
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: var(--font-raleway);
`;
