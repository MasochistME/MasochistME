import React from 'react';

import { useAppContext } from 'context';
import { SearchBar } from 'containers';
import { FilterBar } from 'components';
import { useCuratorMembers } from 'sdk';

export const LeaderboardsFilterBar = (): JSX.Element => {
	const { queryMember, setQueryMember } = useAppContext();
	const { membersData } = useCuratorMembers();

	return (
		<FilterBar>
			<SearchBar
				placeholder="Search members"
				query={queryMember}
				setQuery={setQueryMember}
			/>
			<span style={{ fontStyle: 'italic' }}>
				Members total: {membersData?.length ?? '?'}
			</span>
		</FilterBar>
	);
};
