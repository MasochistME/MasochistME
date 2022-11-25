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

	const rows = races.map(race => ({
		[Columns.DATE]: {
			value: getHumanReadableDate(race.startDate),
		},
		[Columns.RACE_NAME]: {
			value: race.name,
			cell: <TableCell content={race.name} isNoWrap isCentered={false} />,
		},
		[Columns.SIGN_UPS]: {
			value: 2,
			cell: <TableCell content="2" />,
		},
		[Columns.PARTICIPANTS]: { value: 2, cell: <TableCell content="2" /> },
		[Columns.DNF]: { value: 2, cell: <TableCell content="2" /> },
		[Columns.TYPE]: {
			value: race.type,
			cell: <TableCell content={race.type} />,
		},
		[Columns.WINNER]: {
			value: 'Arcyvilk',
			cell: <TableCell content="Arcyvilk" />,
		},
	}));

	const columns = Object.keys(rows[0] ?? []);

	return (
		<Flex column width="100%">
			<Table rows={rows} columns={columns} />
		</Flex>
	);
};
