import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Modal } from '@mui/material';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { useTheme, ColorTokens } from 'styles';
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
		border: `var(--size-1) solid ${colorTokens['core-extra-bg']}`,
		boxShadow: `0 0 var(--size-10) ${colorTokens['common-color--black']}aa`,
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

	const racesToDiscard = participant?.allRaces.slice(-3) ?? [];
	const raceIdsToDiscard = racesToDiscard.map(race => race.raceId);

	const columns: TableColumn<Race>[] = [
		{
			key: Columns.TYPE,
			title: Columns.TYPE,
			value: (race: Race) => race.type,
			render: (race: Race) => (
				<TableCell
					padding="var(--size-8) 0"
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
					padding="var(--size-8)"
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
			render: (race: Race) => (
				<TableCell
					content={
						raceIdsToDiscard?.includes(String(race._id)) ? (
							<Icon
								icon="XMark"
								color={colorTokens['semantic-color--error-strong']}
								hoverText="This race does not count towards the 'Best Of' score"
							/>
						) : null
					}
					padding="var(--size-8)"
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
			<Flex align gap={16} padding="var(--size-8)" paddingBottom={0}>
				<div
					style={{
						border: `var(--size-3) solid ${colorTokens['core-primary-text']}`,
						borderRadius: 'var(--border-radius-8)',
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
	width: 60rem;
	max-width: 100%;
	height: auto;
	gap: var(--size-16);
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}ee;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: var(--font-raleway);
`;

const StyledRaceName = styled.div`
	font-size: var(--font-size-16);
	font-family: var(--font-dosis);
`;

const StyledUsername = styled.h2`
	display: flex;
	align-items: center;
	margin: 0;
	max-width: 60rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: var(--font-size-22);
`;
