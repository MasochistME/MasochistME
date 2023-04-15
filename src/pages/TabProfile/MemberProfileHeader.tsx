import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PatreonTier } from '@masochistme/sdk/dist/v1/types';

import { useMemberById, useMemberLeaderboards } from 'sdk';
import { QueryBoundary, Size } from 'components';
import { media } from 'styles';
import { Flex, Icon, IconType, Tooltip } from 'components';
import { MemberAvatar } from 'containers';

import { MemberProfileUpdate } from './MemberProfileUpdate';

type Props = {
	memberId: string;
	patron: Partial<PatreonTier>;
};

export const MemberProfileHeader = (props: Props) => {
	return (
		<QueryBoundary fallback={<MemberProfileHeaderSkeleton />}>
			<MemberProfileHeaderBoundary {...props} />
		</QueryBoundary>
	);
};
const MemberProfileHeaderBoundary = (props: Props) => {
	const { memberId, patron } = props;

	const { memberData: member, isLoading, isError } = useMemberById(memberId);
	const { leaderData } = useMemberLeaderboards(memberId);

	const description: string =
		member?.description ??
		'Currently there is no info provided about this user.';

	const memberName = useMemo(() => {
		const originalName = member?.name ?? 'Loading...';
		const shortenedName = originalName.slice(0, 27);
		if (shortenedName.length < originalName.length)
			return shortenedName + '...';
		return originalName;
	}, [member]);

	return (
		<StyledMemberProfileHeader row>
			<StyledMemberProfileHeaderAvatar>
				<MemberAvatar
					member={member}
					patronTier={leaderData?.patreonTier}
					size={Size.LARGE}
					isLoading={isLoading}
					isError={isError}
				/>
			</StyledMemberProfileHeaderAvatar>
			<StyledMemberProfileDetails column>
				<StyledMemberProfileTopRow>
					<a
						href={`https://steamcommunity.com/profiles/${member?.steamId}`}
						target="_blank"
						rel="noopener noreferrer">
						<StyledMemberProfileUsername>
							<Icon icon="Steam" marginRight="var(--size-10)" />
							{memberName}
						</StyledMemberProfileUsername>
					</a>
					<MemberProfileUpdate member={member} />
				</StyledMemberProfileTopRow>
				{leaderData?.patreonTier && (
					<Tooltip
						content={`This user is a tier ${
							patron?.description?.toUpperCase() ?? 'Loading...'
						} supporter`}>
						<StyledMemberProfilePatron>
							<Icon icon={patron?.symbol as IconType} />
							<span>{patron?.description?.toUpperCase() ?? 'Loading...'}</span>
						</StyledMemberProfilePatron>
					</Tooltip>
				)}
				<StyledMemberProfileDescription>
					{description ?? 'Loading...'}
				</StyledMemberProfileDescription>
			</StyledMemberProfileDetails>
		</StyledMemberProfileHeader>
	);
};

const MemberProfileHeaderSkeleton = () => (
	<StyledMemberProfileHeader row>
		<StyledMemberProfileHeaderAvatar>
			<MemberAvatar size={Size.LARGE} isLoading />
		</StyledMemberProfileHeaderAvatar>
		<StyledMemberProfileDetails column>
			<StyledMemberProfileTopRow>
				<StyledMemberProfileUsername>
					<Icon icon="Steam" marginRight="var(--size-10)" />
					Loading...
				</StyledMemberProfileUsername>
				<MemberProfileUpdate />
			</StyledMemberProfileTopRow>
			<StyledMemberProfileDescription>
				Loading...
			</StyledMemberProfileDescription>
		</StyledMemberProfileDetails>
	</StyledMemberProfileHeader>
);

const StyledMemberProfileHeader = styled(Flex)`
	max-width: 100%;
	padding: var(--size-8);
	gap: var(--size-16);
	justify-content: space-between;
	align-items: flex-start;
`;

const StyledMemberProfileHeaderAvatar = styled.div`
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledMemberProfileTopRow = styled(Flex)`
	width: 100%;
	justify-content: space-between;
	align-items: center;
`;

const StyledMemberProfileUsername = styled.h2`
	display: flex;
	align-items: center;
	margin: 0;
	max-width: 60rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: var(--font-size-20);
`;

const StyledMemberProfileDetails = styled(Flex)`
	width: 100%;
	gap: var(--size-4);
	align-items: flex-start;
`;

const StyledMemberProfileDescription = styled.div`
	max-width: 100%;
	overflow: hidden;
`;

const StyledMemberProfilePatron = styled(Flex)`
	cursor: help;
	align-items: center;
	gap: var(--size-6);
`;
