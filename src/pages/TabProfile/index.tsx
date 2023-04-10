import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Flex, Loader, QueryBoundary, Warning } from 'components';
import { SubPage } from 'containers';
import { useActiveTab } from 'hooks';
import { TabDict } from 'configuration/tabs';

import { MemberProfileFeaturedSection } from './MemberProfileFeaturedSection';
import { MemberProfileBadgesSection } from './MemberProfileBadgesSection';
import { MemberProfileTop } from './MemberProfileTop';
import { MemberProfileTabs } from './MemberProfileTabs';

export const TabProfile = (): JSX.Element => {
	// ID param will always be defined because this tab is used ONLY for the /profile/:id route.
	const { id } = useParams<{ id: string }>() as { id: string };
	useActiveTab(TabDict.PROFILE, true);

	return (
		<SubPage>
			<QueryBoundary
				fallback={
					<Flex align justify width="100%">
						<Loader />
					</Flex>
				}
				errorFallback={
					<Warning description={`User with id ${id} does not exist.`} />
				}>
				<Flex column width="100%" gap={16}>
					<MemberProfileTop id={id} />
					<MemberProfileTabs id={id} />
				</Flex>
				<StyledSidebar column>
					<MemberProfileBadgesSection memberId={id} />
					<MemberProfileFeaturedSection memberId={id} />
				</StyledSidebar>
			</QueryBoundary>
		</SubPage>
	);
};

const StyledSidebar = styled(Flex)`
	width: 100%;
	max-width: 45rem;
	gap: var(--size-16);
`;
