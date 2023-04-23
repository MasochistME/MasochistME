import React from 'react';

import { useAppContext } from 'context';
import { FilterBar, Input, ToggleButtons } from 'components';
import { TimePeriod } from 'utils/getTimePeriod';

type Props = {
	filter: TimePeriod;
	changeFilter: (filter: TimePeriod) => void;
};

export const LeaderboardsFilterBar = (props: Props): JSX.Element => {
	const { filter, changeFilter } = props;
	const { queryMember, setQueryMember } = useAppContext();

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
				changeValue={changeFilter}
			/>
		</FilterBar>
	);
};
