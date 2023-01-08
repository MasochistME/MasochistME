import { useEffect, useState } from 'react';
import { Race, RaceWithSummary } from '@masochistme/sdk/dist/v1/types';

import {
	DateBlock,
	Flex,
	Icon,
	Table,
	TableCell,
	TableColumn,
} from 'components';
import { ModalRace, WinnerLink } from 'containers';
import styled from 'styled-components';
import { getRaceTypeIcon } from 'utils/getIcon';

type Props = {
	races: Race[];
};

enum Columns {
	DATE = 'Start date',
	RACE_NAME = 'Race name',
	SIGN_UPS = 'Signups',
	PARTICIPANTS = 'Participants',
	DNF = 'DNF',
	TYPE = '',
	WINNER = 'Winner',
}

export const SingleSeasonRaces = (props: Props): JSX.Element => {
	const { races } = props;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);

	const onRaceClick = (raceId: string) => {
		if (raceId) {
			setIsModalOpen(!isModalOpen);
			setSelectedRaceId(raceId);
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
				<TableCell
					content={<DateBlock date={race.startDate} withHours={false} />}
				/>
			),
			style: { width: '100px' },
		},
		{
			key: Columns.TYPE,
			title: Columns.TYPE,
			value: (race: RaceWithSummary) => race.type,
			render: (race: RaceWithSummary) => (
				<TableCell
					content={<Icon icon={getRaceTypeIcon(race)} hoverText={race.type} />}
				/>
			),
		},
		{
			key: Columns.RACE_NAME,
			title: Columns.RACE_NAME,
			value: (race: RaceWithSummary) => race.name,
			render: (race: RaceWithSummary) => {
				const raceId = String(race._id);
				return (
					<TableCell
						content={
							<TableCellRaceName onClick={() => onRaceClick(raceId)}>
								{race.name}
							</TableCellRaceName>
						}
						isNoWrap
						isCentered={false}
						textTransform="uppercase"
						fontWeight={600}
					/>
				);
			},
		},
		{
			key: Columns.SIGN_UPS,
			title: Columns.SIGN_UPS,
			value: (race: RaceWithSummary) => String(race.summary?.signups ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.signups} />
			),
		},
		{
			key: Columns.PARTICIPANTS,
			title: Columns.PARTICIPANTS,
			value: (race: RaceWithSummary) => String(race.summary?.participants ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.participants} />
			),
		},
		{
			key: Columns.DNF,
			title: Columns.DNF,
			value: (race: RaceWithSummary) => String(race.summary?.dnf ?? 0),
			render: (race: RaceWithSummary) => (
				<TableCell content={race.summary?.dnf} />
			),
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
	&:hover {
		color: white;
	}
`;
