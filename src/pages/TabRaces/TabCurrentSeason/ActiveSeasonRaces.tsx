import React from 'react';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { Flex, Table, TableCell } from 'components';
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

	const columns = (race: Race) => {
		return [
			{
				key: Columns.DATE,
				title: Columns.DATE,
				value: getHumanReadableDate(race.startDate),
				cell: <TableCell content={getHumanReadableDate(race.startDate)} />,
			},
			{
				key: Columns.RACE_NAME,
				title: Columns.RACE_NAME,
				value: race.name,
				cell: <TableCell content={race.name} isNoWrap isCentered={false} />,
			},
			{
				key: Columns.SIGN_UPS,
				title: Columns.SIGN_UPS,
				value: 2,
				cell: <TableCell content="2" />,
			},
			{
				key: Columns.PARTICIPANTS,
				title: Columns.PARTICIPANTS,
				value: 2,
				cell: <TableCell content="2" />,
			},
			{
				key: Columns.DNF,
				title: Columns.DNF,
				value: 2,
				cell: <TableCell content="2" />,
			},
			{
				key: Columns.TYPE,
				title: Columns.TYPE,
				value: race.type,
				cell: <TableCell content={race.type} />,
			},
			{
				key: Columns.WINNER,
				title: Columns.WINNER,
				value: 'Arcyvilk',
				cell: <TableCell content="Arcyvilk" />,
			},
		];
	};

	return (
		<Flex column width="100%">
			<Table columns={columns} dataset={races} />
		</Flex>
	);
};
