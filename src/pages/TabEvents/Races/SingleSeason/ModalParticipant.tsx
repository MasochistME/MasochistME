import React from 'react';
import styled from 'styled-components';
import { Box, Modal } from '@mui/material';

import { fonts, useTheme, ColorTokens } from 'styles';
import { Flex } from 'components';

import { SeasonSummary } from './SingleSeasonRanking';
import { useRacesFromSeason } from 'hooks';

type Props = {
	participant: SeasonSummary | null;
	seasonId: string;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
};

export const ModalParticipant = (props: Props) => {
	const { participant, seasonId, isModalOpen, setIsModalOpen } = props;
	const { colorTokens } = useTheme();
	const { races } = useRacesFromSeason(seasonId);

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
		<Modal open={isModalOpen && !!participant} onClose={handleModalClose}>
			<Box sx={modalStyle}>
				<WrapperRace column colorTokens={colorTokens}>
					{participant?.allRaces.map(r => {
						const race = races.find(rr => r.raceId === String(rr._id));
						return (
							<Flex>
								{race?.name ?? r.raceId} - {r.points}pts - {String(r.dnf)} -{' '}
								{String(r.disqualified)}
							</Flex>
						);
					})}
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
	/* padding: 16px; */
`;
