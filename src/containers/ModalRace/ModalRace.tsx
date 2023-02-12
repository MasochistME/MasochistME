import React from 'react';
import styled from 'styled-components';
import { Box, Modal } from '@mui/material';

import { fonts, useTheme, ColorTokens } from 'styles';
import { Flex } from 'components';

import { ModalRaceHeader } from './ModalRaceHeader';
import { ModalRaceLeaderboards } from './ModalRaceLeaderboards';

type Props = {
	raceId: string | null;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
};

export const ModalRace = (props: Props): JSX.Element | null => {
	const { raceId, isModalOpen, setIsModalOpen } = props;
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
		border: `1px solid ${colorTokens['core-extra-bg']}`,
		boxShadow: `0 0 10px ${colorTokens['common-color--black']}aa`,
	};

	return (
		<Modal open={isModalOpen && !!raceId} onClose={handleModalClose}>
			<Box sx={modalStyle}>
				<WrapperRace column colorTokens={colorTokens}>
					<ModalRaceHeader raceId={raceId} />
					<ModalRaceLeaderboards raceId={raceId} />
				</WrapperRace>
			</Box>
		</Modal>
	);
};

export const WrapperRace = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	text-align: center;
	width: 600px;
	max-width: 100%;
	height: auto;
	gap: 16px;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: ${fonts.Raleway};
	padding: 16px;
`;
