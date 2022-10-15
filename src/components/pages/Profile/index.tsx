import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useUsers } from 'shared/hooks';
import { showProfile } from 'shared/store/modules/Profiles';
import { Flex, Wrapper, Spinner, Section, BigBadge } from 'shared/components';
import { Badges } from './styles';
import { useUserDetails } from 'components/init';

import FullProfile from './FullProfile';
import ProfileHeader from './ProfileHeader';

Profile.Badges = Badges;
Profile.Badge = BigBadge;
Profile.Section = Section;

export default function Profile(): JSX.Element {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();
	const { isUserLoaded } = useUserDetails(id);
	const users = useUsers(false);

	const userBasic = users.find((user: any) => user.id === id);

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

	useEffect(() => {
		window.scrollTo(0, 0);
		dispatch(showProfile(id));
	}, [id]);

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
}

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
