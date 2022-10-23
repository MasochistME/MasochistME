import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useMemberById, useMemberLeaderboards, usePatreonTiers } from 'sdk';
import { Size } from 'utils';
import { colors, media } from 'shared/theme';
import { Flex, Tooltip } from 'components';
import { MemberAvatar } from 'containers';

import { MemberProfileUpdate } from './MemberProfileUpdate';

type Props = {
	memberId: string;
};

export const MemberProfileHeader = (props: Props): JSX.Element => {
	const { memberId } = props;

	const { memberData: member, isLoading, isError } = useMemberById(memberId);
	const { leaderData } = useMemberLeaderboards(memberId);
	const { patreonTiersData } = usePatreonTiers();

	const description: string =
		member?.description ??
		'Currently there is no info provided about this user.';
	const patron = patreonTiersData.find(
		tier => tier.tier === leaderData?.patreonTier,
	) ?? {
		description: 'Unknown',
		symbol: 'fas fa-medal',
	};

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
					<StyledMemberProfileUsername>
						<a
							href={`https://steamcommunity.com/profiles/${member?.steamId}`}
							target="_blank"
							rel="noopener noreferrer">
							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
							{memberName}
						</a>
					</StyledMemberProfileUsername>
					<MemberProfileUpdate member={member} />
				</StyledMemberProfileTopRow>
				{leaderData?.patreonTier && (
					<Tooltip
						content={`This user is a tier ${
							patron?.description?.toUpperCase() ?? 'Loading...'
						} supporter`}>
						<StyledMemberProfilePatron>
							<i className={patron?.symbol} />{' '}
							{patron?.description?.toUpperCase() ?? 'Loading...'}{' '}
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

const StyledMemberProfileHeader = styled(Flex)`
	max-width: 100%;
	padding: 8px;
	gap: 16px;
	justify-content: space-between;
	align-items: flex-start;
	background-color: ${colors.black}66;
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
	margin: 0;
	max-width: 600px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const StyledMemberProfileDetails = styled(Flex)`
	width: 100%;
	gap: 4px;
	align-items: flex-start;
`;

const StyledMemberProfileDescription = styled.div`
	max-width: 100%;
	overflow: hidden;
`;

const StyledMemberProfilePatron = styled.div`
	cursor: help;
`;
