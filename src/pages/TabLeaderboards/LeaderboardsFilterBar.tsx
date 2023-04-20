import React from 'react';

import { useAppContext } from 'context';
import { FilterBar, Input, ToggleButtons } from 'components';
import { TimePeriod } from 'utils/getTimePeriod';
import { t } from 'i18n';

export const LeaderboardsFilterBar = (): JSX.Element => {
	const {
		queryMember,
		setQueryMember,
		queryLeaderboardPeriod,
		setQueryLeaderboardPeriod,
	} = useAppContext();

	const options = [
		{
			label: t('leaderboards.filter.all'),
			value: TimePeriod.ALL,
		},
		{
			label: t('leaderboards.filter.past_week'),
			value: TimePeriod.PAST_WEEK,
		},
		{
			label: t('leaderboards.filter.past_month'),
			value: TimePeriod.PAST_MONTH,
		},
		{
			label: t('leaderboards.filter.past_year'),
			value: TimePeriod.PAST_YEAR,
		},
	];

	return (
		<FilterBar>
			<Input
				placeholder={t('leaderboards.filter.search_placeholder')}
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
