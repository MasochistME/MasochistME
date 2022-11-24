import React from 'react';
import { Race } from '@masochistme/sdk/dist/v1/types';

import { Flex, Table } from 'components';
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
		},
		[Columns.SIGN_UPS]: { value: 2 },
		[Columns.PARTICIPANTS]: { value: 2 },
		[Columns.DNF]: { value: 2 },
		[Columns.TYPE]: { value: race.type },
		[Columns.WINNER]: { value: 'Arcyvilk' },
	}));

	const columns = Object.keys(rows[0] ?? []);

	return (
		<Flex column width="100%">
			<Table rows={rows} columns={columns} />
		</Flex>
	);
};
