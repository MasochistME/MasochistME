import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Modal } from '@mui/material';

import { fonts, useTheme, ColorTokens } from 'styles';
import { Flex, Size, Table, TableCell, TableColumn } from 'components';

import { SeasonSummary } from './SingleSeasonRanking';
import { useRacesFromSeason } from 'hooks';
import { Race } from '@masochistme/sdk/dist/v1/types';
import { MemberAvatar } from 'containers';

type Props = {
	participant: SeasonSummary | null;
	seasonId: string;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
};

export const ModalParticipant = (props: Props) => {
	const { participant, seasonId, isModalOpen, setIsModalOpen } = props;
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
		<Modal open={isModalOpen && !!participant} onClose={handleModalClose}>
			<Box sx={modalStyle}>
				<WrapperRace column colorTokens={colorTokens}>
					<RacesTable seasonId={seasonId} participant={participant} />
				</WrapperRace>
			</Box>
		</Modal>
	);
};

enum Columns {
	NAME = 'Race name',
	POINTS = 'Pts',
	DNF = 'DNF',
	DISQUALIFIED = 'Disqualified',
}

const RacesTable = ({
	seasonId,
	participant,
}: Pick<Props, 'seasonId' | 'participant'>) => {
	const { races } = useRacesFromSeason(seasonId);

	const columns: TableColumn<Race>[] = [
		{
			key: Columns.NAME,
			title: Columns.NAME,
			value: (race: Race) => race.name,
			render: (race: Race) => (
				<TableCell
					isCentered={false}
					content={race.name}
					padding="8px"
					textAlign="left"
				/>
			),
		},
		{
			key: Columns.POINTS,
			title: Columns.POINTS,
			value: (race: Race) =>
				participant?.allRaces.find(r => r.raceId === String(race._id))
					?.points ?? 0,
			render: (race: Race) => (
				<TableCell
					content={
						participant?.allRaces.find(r => r.raceId === String(race._id))
							?.points ?? 0
					}
				/>
			),
		},
		{
			key: Columns.DNF,
			title: Columns.DNF,
			value: (race: Race) =>
				Number(
					participant?.allRaces.find(r => r.raceId === String(race._id))?.dnf,
				) ?? 0,
			render: (race: Race) => (
				<TableCell
					content={String(
						participant?.allRaces.find(r => r.raceId === String(race._id))
							?.dnf ?? '—',
					)}
				/>
			),
		},
		{
			key: Columns.DISQUALIFIED,
			title: Columns.DISQUALIFIED,
			value: (race: Race) =>
				Number(
					participant?.allRaces.find(r => r.raceId === String(race._id))
						?.disqualified,
				) ?? 0,
			render: (race: Race) => (
				<TableCell
					content={String(
						participant?.allRaces.find(r => r.raceId === String(race._id))
							?.disqualified ?? '—',
					)}
				/>
			),
		},
	];
	return (
		<Flex column gap={16}>
			<Flex align gap={16}>
				<MemberAvatar member={participant?.member} size={Size.MEDIUM} />
				<Link to={`/profile/${participant?.member?.steamId}`}>
					<StyledUsername>{participant?.member?.name ?? '—'}</StyledUsername>
				</Link>
			</Flex>
			<Table columns={columns} dataset={races} rowsPerPage={10} />
		</Flex>
	);
};

export const WrapperRace = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	text-align: center;
	width: 600px;
	max-width: 100%;
	height: auto;
	gap: 16px;
	padding: 16px;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: ${fonts.Raleway};
`;

const StyledUsername = styled.h2`
	display: flex;
	align-items: center;
	margin: 0;
	max-width: 600px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 24px;
`;
