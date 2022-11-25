import React from 'react';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { Flex, Table, TableCell, TableColumn } from 'components';
import { getHumanReadableDate } from 'utils';

type Props = {
	races: Race[];
};

enum Columns {
	DATE = 'Date',
	RACE_NAME = 'Race name',
	SIGN_UPS = 'Sign-ups',
	PARTICIPANTS = 'Participants',
	DNF = 'DNF',
	TYPE = 'Type',
	WINNER = 'Winner',
}

export const ActiveSeasonRaces = (props: Props): JSX.Element => {
	const { races } = props;

	const columns: TableColumn<Race>[] = [
		{
			key: Columns.DATE,
			title: Columns.DATE,
			value: (race: Race) => getHumanReadableDate(race.startDate),
			render: (race: Race) => (
				<TableCell content={getHumanReadableDate(race.startDate)} />
			),
		},
		{
			key: Columns.RACE_NAME,
			title: Columns.RACE_NAME,
			value: (race: Race) => race.name,
			render: (race: Race) => (
				<TableCell content={race.name} isNoWrap isCentered={false} />
			),
		},
		{
			key: Columns.SIGN_UPS,
			title: Columns.SIGN_UPS,
			value: () => 2,
			render: () => <TableCell content="2" />,
		},
		{
			key: Columns.PARTICIPANTS,
			title: Columns.PARTICIPANTS,
			value: () => 2,
			render: () => <TableCell content="2" />,
		},
		{
			key: Columns.DNF,
			title: Columns.DNF,
			value: () => 2,
			render: () => <TableCell content="2" />,
		},
		{
			key: Columns.TYPE,
			title: Columns.TYPE,
			value: (race: Race) => race.type,
			render: (race: Race) => <TableCell content={race.type} />,
		},
		{
			key: Columns.WINNER,
			title: Columns.WINNER,
			value: () => 'Arcyvilk',
			render: () => <TableCell content="Arcyvilk" />,
		},
	];

	return (
		<Flex column width="100%">
			<Table columns={columns} dataset={races} />
		</Flex>
	);
};
