import React from 'react';
import { useParams } from 'react-router-dom';
import { Member } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers } from 'sdk';
import { Flex, Wrapper, Spinner } from 'components';
import { useActiveTab } from 'shared/hooks';

import { FullProfile } from './FullProfile';
import { ProfileHeader } from './ProfileHeader';
import { TabDict } from 'shared/config/tabs';

export const TabProfile = (): JSX.Element => {
	useActiveTab(TabDict.PROFILE);

	const { id } = useParams<{ id: string }>();
	const { membersData, isLoading, isError, isFetched } = useCuratorMembers();

	const member = membersData.find((m: Member) => m.steamId === id);

	const isUserPrivate = member?.isPrivate;
	const isUserNotAMember = member && !member.isMember && !member.isProtected;

	return (
		<Flex column width="100%">
			{!isError && <ProfileHeader member={member} error={false} />}
			{isLoading && <Spinner />}
			{isUserPrivate && (
				<ProfileWarning description="This user has their profile set to private." />
			)}
			{isUserNotAMember && (
				<ProfileWarning description="This user is no longer a member of the curator." />
			)}
			{isError && (
				<ProfileWarning description={`User with id ${id} does not exist.`} />
			)}
			{isFetched && member && <FullProfile member={member} />}
		</Flex>
	);
};

type ProfileWarningProps = {
	description: string;
};
const ProfileWarning = (props: ProfileWarningProps): JSX.Element => {
	const { description } = props;

	return (
		<Wrapper type="description">
			<p style={{ fontWeight: 'bold', fontSize: '1.5em' }}>⚠️ {description}</p>
		</Wrapper>
	);
};
