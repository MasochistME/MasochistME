import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useMemberById, useMemberLeaderboards } from 'sdk';
import { Flex, Warning } from 'components';
import { SubPage } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { MemberProfileHeader } from './MemberProfileHeader';
import { MemberProfileGraphs } from './MemberProfileGraphs';
import { MemberProfileBadges } from './MemberProfileBadges';

const TabProfile = (): JSX.Element => {
	useActiveTab(TabDict.PROFILE);

	const { id } = useParams<{ id: string }>();
	const { memberData: member, isError } = useMemberById(id);
	const { leaderData } = useMemberLeaderboards(id);

	const isUserPrivate = member?.isPrivate;
	const isUserNotAMember = member && !member.isMember && !member.isProtected;

	if (isError)
		return (
			<SubPage>
				<Warning description={`User with id ${id} does not exist.`} />
			</SubPage>
		);
	return (
		<SubPage>
			<StyledProfile column>
				<MemberProfileHeader memberId={id} />
				{isUserPrivate && (
					<Warning description="This user has their profile set to private." />
				)}
				{isUserNotAMember && (
					<Warning description="This user is no longer a member of the curator." />
				)}
				{leaderData?.sum ? <MemberProfileGraphs memberId={id} /> : null}
			</StyledProfile>
			<MemberProfileBadges memberId={id} />
		</SubPage>
	);
};

export default TabProfile;

const StyledProfile = styled(Flex)`
	flex: 1 1 100%;
	overflow: hidden;
`;
