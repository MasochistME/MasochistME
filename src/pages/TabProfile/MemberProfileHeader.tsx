import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { useMemberById, useMemberLeaderboards, usePatreonTiers } from 'sdk';
import { Size } from 'utils';
import { colors, media } from 'shared/theme';
import { Flex, Tooltip, Button } from 'components';
import { MemberAvatar } from 'containers';

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
	};

	const handleMemberUpdate = () => {
		// TODO
		alert('This is not implemented yet :(');
	};

	return (
		<StyledMemberProfileHeader row>
			<MemberAvatar
				member={member}
				patronTier={leaderData?.patreonTier}
				size={Size.LARGE}
				isLoading={isLoading}
				isError={isError}
			/>
			<StyledMemberProfileDetails column>
				<Flex row align width="100%" justifyContent="space-between">
					<h1 style={{ margin: '0' }}>
						<a
							href={`https://steamcommunity.com/profiles/${member?.steamId}`}
							target="_blank"
							rel="noopener noreferrer">
							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
							{member?.name ?? 'Loading...'}
						</a>
					</h1>
					<Flex row align gap={12}>
						<Tooltip
							content={dayjs(member?.lastUpdated).format(
								'D MMM YYYY, H:mm:ss',
							)}>
							<Flex column alignItems="flex-end" fontSize="0.8em">
								<span>Last updated:</span>
								<span style={{ fontStyle: 'italic' }}>
									{dayjs(member?.lastUpdated).fromNow()}
								</span>
							</Flex>
						</Tooltip>
						<Button
							label="Update"
							icon="fas fa-refresh"
							onClick={() => handleMemberUpdate()}
						/>
					</Flex>
				</Flex>
				{leaderData?.patreonTier && (
					<Tooltip
						content={`This user is a tier ${
							patron?.description?.toUpperCase() ?? 'Loading...'
						} supporter`}>
						<StyledMemberProfilePatron>
							<i className="fas fa-medal" />{' '}
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
	margin-bottom: 10px;
	padding: 8px;
	gap: 16px;
	justify-content: space-between;
	align-items: flex-start;
	background-color: ${colors.black}66;
`;

const StyledMemberProfileDetails = styled(Flex)`
	max-width: 100%;
	flex: 1 1 100%;
	gap: 4px;
	align-items: flex-start;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledMemberProfileDescription = styled.div`
	max-width: 100%;
	overflow: hidden;
`;

const StyledMemberProfilePatron = styled.div`
	cursor: help;
`;
