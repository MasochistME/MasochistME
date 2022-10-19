import React from 'react';

import { useAppContext } from 'shared/store/context';
import { SearchBar } from 'containers';
import { FilterBar } from 'components';

export const LeaderboardsFilterBar = (): JSX.Element => {
	const { queryMember, setQueryMember } = useAppContext();

	return (
		<FilterBar>
			<SearchBar
				placeholder="Search members"
				query={queryMember}
				setQuery={setQueryMember}
			/>
		</FilterBar>
	);
};
