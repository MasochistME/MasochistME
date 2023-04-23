import { useEffect, useState } from 'react';
import { Race, RaceWithSummary } from '@masochistme/sdk/dist/v1/types';

import {
	DateBlock,
	Flex,
	Icon,
	Size,
	Table,
	TableCell,
	TableColumn,
} from 'components';
import { ModalRace, WinnerLink } from 'containers';
import styled from 'styled-components';
import { getRaceTypeIcon } from 'utils/getIcon';
import { media } from 'styles';
import { useMixpanel } from 'hooks';

type Props = {
	races: Race[];
};

enum Columns {
	DATE = 'Start date',
	RACE_NAME = 'Race name',
	SIGN_UPS = 'Sign-ups',
	PARTICIPANTS = 'Participants',
	DNF = 'DNF',
	TYPE = '',
	WINNER = 'Winner',
}

export const SingleSeasonRaces = (props: Props): JSX.Element => {
	const { races } = props;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
	const { track } = useMixpanel();

	const onRaceClick = (raceId: string) => {
		if (raceId) {
			setIsModalOpen(!isModalOpen);
			setSelectedRaceId(raceId);
			track('race.click', { raceId });
		}
	};

	useEffect(() => {
		if (!isModalOpen) setSelectedRaceId(null);
	}, [isModalOpen]);

	const columns: TableColumn<RaceWithSummary>[] = [
		{
			key: Columns.DATE,
			title: Columns.DATE,
			value: (race: RaceWithSummary) => new Date(race.startDate ?? 0).getTime(),
			render: (race: RaceWithSummary) => (
				<DateBlock date={race.startDate} withHours={false} shouldHide={false} />
			),
			style: { width: '9rem' },
		},
		{
			key: Columns.TYPE,
			title: Columns.TYPE,
			value: (race: RaceWithSummary) => race.type,
			render: (race: RaceWithSummary) => (
				<TableCell
					padding="var(--size-8) 0"
					content={
						<CellResponsive>
							<span className="icon__mobile">
								<Icon
									icon={getRaceTypeIcon(race)}
									size={Size.SMALL}
									hoverText={`${race.type.toUpperCase()} based race`}
								/>
							</span>
							<span className="icon__desktop">
								<Icon
									icon={getRaceTypeIcon(race)}
									size={Size.MICRO}
									hoverText={`${race.type.toUpperCase()} based race`}
								/>
							</span>
						</CellResponsive>
					}
				/>
			),
			style: { width: '3rem' },
		},
		{
			key: Columns.RACE_NAME,
			title: Columns.RACE_NAME,
			value: (race: RaceWithSummary) => race.name.toUpperCase(),
			render: (race: RaceWithSummary) => {
				const raceId = String(race._id);
				return (
					<TableCell
						content={
							<TableCellRaceName onClick={() => onRaceClick(raceId)}>
								{race.name}
							</TableCellRaceName>
						}
						isCentered={false}
						textTransform="uppercase"
						fontWeight={600}
						textAlign="left"
					/>
				);
			},
			style: { width: '100%', maxWidth: '50%' },
		},
		{
			key: Columns.SIGN_UPS,
			title: Columns.SIGN_UPS,
			value: (race: RaceWithSummary) => String(race.summary?.signups ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.signups} />
			),
			style: { maxWidth: '5rem' },
		},
		{
			key: Columns.PARTICIPANTS,
			title: Columns.PARTICIPANTS,
			value: (race: RaceWithSummary) => String(race.summary?.participants ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.participants} />
			),
			style: { maxWidth: '5rem' },
		},
		{
			key: Columns.DNF,
			title: Columns.DNF,
			value: (race: RaceWithSummary) => String(race.summary?.dnf ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.dnf} />
			),
			style: { width: '4rem' },
		},
		{
			key: Columns.WINNER,
			title: Columns.WINNER,
			value: (race: RaceWithSummary) => String(race.summary?.winner),
			render: (race: RaceWithSummary) => (
				<TableCell
					content={
						<WinnerLink discordId={race.summary?.winner} isCompact={false} />
					}
				/>
			),
			style: { maxWidth: '20rem' },
		},
	];

	return (
		<Flex column width="100%">
			<Table columns={columns} dataset={races} rowsPerPage={10} />
			<ModalRace
				raceId={selectedRaceId}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
			/>
		</Flex>
	);
};

const TableCellRaceName = styled(Flex)`
	font-size: var(--font-size-14);
	font-family: var(--font-dosis);
	&:hover {
		color: white;
	}
	@media (max-width: ${media.smallNetbooks}) {
		font-size: var(--font-size-12);
	}
`;

const CellResponsive = styled.div`
	& .icon__mobile {
		@media (max-width: ${media.smallNetbooks}) {
			display: none;
		}
	}
	& .icon__desktop {
		@media (min-width: ${media.smallNetbooks}) {
			display: none;
		}
	}
`;
