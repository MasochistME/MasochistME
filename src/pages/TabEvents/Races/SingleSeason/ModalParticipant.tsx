import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Modal } from '@mui/material';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { fonts, useTheme, ColorTokens } from 'styles';
import { Flex, Icon, Size, Table, TableCell, TableColumn } from 'components';
import { useRacesFromSeason } from 'hooks';
import { MemberAvatar } from 'containers';
import { getRaceTypeIcon } from 'utils';

import { SeasonSummary } from './SingleSeasonRanking';

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
				<RacesTable seasonId={seasonId} participant={participant} />
			</Box>
		</Modal>
	);
};

enum Columns {
	TYPE = 'Type',
	NAME = 'Race name',
	COUNTS_TO_SCORE = '',
	POINTS = 'Pts',
	DNF = 'DNF',
	DISQUALIFIED = 'DQ',
}

const RacesTable = ({
	seasonId,
	participant,
}: Pick<Props, 'seasonId' | 'participant'>) => {
	const { colorTokens } = useTheme();
	const { races } = useRacesFromSeason(seasonId);

	const columns: TableColumn<Race>[] = [
		{
			key: Columns.TYPE,
			title: Columns.TYPE,
			value: (race: Race) => race.type,
			render: (race: Race) => (
				<TableCell
					padding="8px 0"
					content={
						<Icon
							icon={getRaceTypeIcon(race)}
							size={Size.MICRO}
							hoverText={`${race.type.toUpperCase()} based race`}
						/>
					}
				/>
			),
		},
		{
			key: Columns.NAME,
			title: Columns.NAME,
			value: (race: Race) => race.name,
			render: (race: Race) => (
				<TableCell
					isCentered={false}
					content={<StyledRaceName>{race.name.toUpperCase()}</StyledRaceName>}
					padding="8px"
					textAlign="left"
				/>
			),
			style: { width: '60%' },
		},
		{
			key: Columns.COUNTS_TO_SCORE,
			title: (
				<Icon
					icon="CircleInfo"
					hoverText="Races marked with X won't count towards the 'Best Of' score"
				/>
			),
			value: () => 0,
			render: () => (
				<TableCell
					content={
						<Icon
							icon="XMark"
							color={colorTokens['semantic-color--error-strong']}
							hoverText="This race does not count towards the 'Best Of' score"
						/>
					}
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
				participant?.allRaces.find(r => r.raceId === String(race._id))?.dnf
					? 1
					: 0,
			render: (race: Race) => (
				<TableCell
					content={
						participant?.allRaces.find(r => r.raceId === String(race._id))?.dnf
							? 'yes'
							: 'no'
					}
				/>
			),
		},
		{
			key: Columns.DISQUALIFIED,
			title: Columns.DISQUALIFIED,
			value: (race: Race) =>
				participant?.allRaces.find(r => r.raceId === String(race._id))
					?.disqualified
					? 1
					: 0,
			render: (race: Race) => (
				<TableCell
					content={
						participant?.allRaces.find(r => r.raceId === String(race._id))
							?.disqualified
							? 'yes'
							: 'no'
					}
				/>
			),
		},
	];
	return (
		<WrapperRace column colorTokens={colorTokens}>
			<Flex align gap={16} padding="8px" paddingBottom={0}>
				<div
					style={{
						border: `3px solid ${colorTokens['core-primary-text']}`,
						borderRadius: '8px',
					}}>
					<MemberAvatar member={participant?.member} size={Size.BIG} />
				</div>
				<Link to={`/profile/${participant?.member?.steamId}`}>
					<StyledUsername>{participant?.member?.name ?? '—'}</StyledUsername>
				</Link>
			</Flex>
			<Table columns={columns} dataset={races} rowsPerPage={10} />
		</WrapperRace>
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
`;

const StyledRaceName = styled.div`
	font-size: 1.3em;
	font-family: ${fonts.Dosis};
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
