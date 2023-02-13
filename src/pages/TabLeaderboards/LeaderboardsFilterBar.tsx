import React from 'react';

import { useAppContext } from 'context';
import { FilterBar, Input, ToggleButtons } from 'components';
import { TimePeriod } from 'utils/getTimePeriod';

export const LeaderboardsFilterBar = (): JSX.Element => {
	const {
		queryMember,
		setQueryMember,
		queryLeaderboardPeriod,
		setQueryLeaderboardPeriod,
	} = useAppContext();

	const options = [
		{
			label: 'All',
			value: TimePeriod.ALL,
		},
		{
			label: 'Past week',
			value: TimePeriod.PAST_WEEK,
		},
		{
			label: 'Past month',
			value: TimePeriod.PAST_MONTH,
		},
		{
			label: 'Past year',
			value: TimePeriod.PAST_YEAR,
		},
	];

	return (
		<FilterBar>
			<Input
				placeholder="Search members"
				query={queryMember}
				setQuery={setQueryMember}
				icon="Search"
			/>
			<ToggleButtons
				options={options}
				value={queryLeaderboardPeriod}
				changeValue={setQueryLeaderboardPeriod}
			/>
		</FilterBar>
	);
};
