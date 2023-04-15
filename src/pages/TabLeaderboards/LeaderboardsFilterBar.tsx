import React, { useEffect } from 'react';

import { useAppContext } from 'context';
import { FilterBar, Input, ToggleButtons } from 'components';
import { TimePeriod } from 'utils/getTimePeriod';
import { useContextualRouting } from 'hooks';

export const LeaderboardsFilterBar = (): JSX.Element => {
	const {
		queryMember,
		setQueryMember,
		queryLeaderboardPeriod,
		setQueryLeaderboardPeriod,
	} = useAppContext();

	const { navigateToRoute, route: filter } = useContextualRouting<TimePeriod>({
		key: 'filter',
		value: queryLeaderboardPeriod,
	});

	const changeValue = (period: TimePeriod) => {
		setQueryLeaderboardPeriod(period);
		navigateToRoute({ filter: period });
	};

	useEffect(() => {
		setQueryLeaderboardPeriod(filter);
	}, []);

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
				value={filter}
				changeValue={changeValue}
			/>
		</FilterBar>
	);
};
