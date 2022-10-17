import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useActiveTab, useMembers } from 'shared/hooks';
import { Flex, Wrapper, Spinner, Section, BigBadge } from 'components';
import { Badges } from './styles';
import { useUserDetails } from 'shared/hooks';

import FullProfile from './FullProfile';
import ProfileHeader from './ProfileHeader';
import { TabDict } from 'shared/config/tabs';

export const TabProfile = (): JSX.Element => {
	useActiveTab(TabDict.PROFILE);

	const { id } = useParams<{ id: string }>();
	const { isUserLoaded } = useUserDetails(id);
	const { membersData } = useMembers();

	const userBasic = membersData.find((user: any) => user.id === id);

	const user = useSelector((state: any) => {
		if (!isUserLoaded) {
			return;
		}
		const userDetails = state.users.details.find((user: any) => user.id === id);
		const userRanking = state.ranking.find(
			(user: any) => user.id === id,
		)?.points;
		return {
			...userBasic,
			...userDetails,
			points: userRanking,
		};
	});

	const isUserLoading = !isUserLoaded;
	const isUserPrivate = user?.private;
	const isUserError = user?.error;
	const isUserNotAMember =
		!isUserPrivate && !isUserError && user && !user.member && !user.protected;
	const showUserProfile =
		!isUserLoading && !isUserPrivate && !isUserError && !isUserNotAMember;

	return (
		<Flex column>
			{!isUserError && <ProfileHeader user={userBasic} error={isUserError} />}
			{isUserLoading && <Spinner />}
			{isUserPrivate && (
				<ProfileWarning description="This user has their profile set to private." />
			)}
			{isUserNotAMember && (
				<ProfileWarning description="This user is no longer a member of the curator." />
			)}
			{isUserError && (
				<ProfileWarning
					description={
						user.error === 404
							? `User with id ${id} does not exist.`
							: 'We could not contact the server. Please try again later.'
					}
				/>
			)}
			{showUserProfile && <FullProfile user={user} />}
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

TabProfile.Badges = Badges;
TabProfile.Badge = BigBadge;
TabProfile.Section = Section;
