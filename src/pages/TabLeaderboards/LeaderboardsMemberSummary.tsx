import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PatronTier } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useLeaderboardsMembers } from 'sdk';
import { colors, media } from 'shared/theme';
import { MemberAvatar } from 'containers';
import { Flex } from 'components';
import { Size } from 'utils';

import { LeaderboardsMemberPoints } from './LeaderboardsMemberPoints';
import {
	LeaderboardsMemberIconPatron,
	LeaderboardsMemberIconPrivate,
	LeaderboardsMemberIconOutdated,
	LeaderboardsMemberIconDummy,
} from './LeaderboardsMemberIcons';

type Props = {
	steamId: string;
	position: number;
	onShowDetails: () => void;
};

export const LeaderboardsMemberSummary = (props: Props): JSX.Element => {
	const history = useHistory();
	const { steamId, position, onShowDetails } = props;
	const [isExpanded, setIsExpanded] = useState(false);

	const { leaderboardsData } = useLeaderboardsMembers();
	const { membersData } = useCuratorMembers();

	const leaderData = leaderboardsData.find(l => l.memberId === steamId);
	const memberData = membersData.find(m => m.steamId === steamId);

	const size = Size.BIG;
	const isDisabled = memberData?.isPrivate;
	const isHighestPatronTier = leaderData?.patreonTier === PatronTier.TIER4;

	const member = {
		...leaderData,
		name: memberData?.name ?? 'UNKNOWN',
		avatar: memberData?.avatar ?? 'UNKNOWN',
		isPrivate: memberData?.isPrivate ?? true,
		lastUpdated: memberData?.lastUpdated ?? 0,
	};

	const infoIcon = () => {
		if (member?.isPrivate) return <LeaderboardsMemberIconPrivate />;
		if (Date.now() - new Date(member?.lastUpdated).getTime() > 2592000000)
			return (
				<LeaderboardsMemberIconOutdated lastUpdated={member?.lastUpdated} />
			);
		return <LeaderboardsMemberIconDummy />;
	};

	const onShowDetailsClick = (
		event: React.MouseEvent<HTMLDivElement>,
	): void => {
		setIsExpanded(!isExpanded);
		onShowDetails();
		event.stopPropagation();
	};

	const onShowProfile = () => {
		if (steamId) history.push(`/profile/${steamId}`);
	};

	return (
		<StyledLeaderboardsMemberSummary
			isHighestPatronTier={isHighestPatronTier}
			isDisabled={isDisabled}
			onClick={onShowProfile}>
			<StyledLeaderboardsMemberDetailsImages>
				<Flex>
					<StyledMemberPosition align justify size={size}>
						{position}.
					</StyledMemberPosition>
					<MemberAvatar member={memberData!} size={size} />
				</Flex>
				<StyledLeaderboardsMemberIcons>
					<LeaderboardsMemberIconPatron patronTier={leaderData?.patreonTier} />
				</StyledLeaderboardsMemberIcons>
			</StyledLeaderboardsMemberDetailsImages>
			<StyledLeaderboardsMemberDetails align>
				<StyledLeaderboardsMemberExpandIcon onClick={onShowDetailsClick}>
					<i className={`fas fa-chevron-${isExpanded ? 'down' : 'up'}`} />
				</StyledLeaderboardsMemberExpandIcon>
				<StyledLeaderboardsMemberUsername style={{ gap: 8 }}>
					<h4>{member.name}</h4>
					{infoIcon()}
				</StyledLeaderboardsMemberUsername>
				<LeaderboardsMemberPoints steamId={steamId} />
			</StyledLeaderboardsMemberDetails>
		</StyledLeaderboardsMemberSummary>
	);
};

type SummaryProps = {
	isDisabled?: boolean;
	isHighestPatronTier?: boolean;
};

const StyledLeaderboardsMemberSummary = styled(Flex)<SummaryProps>`
	justify-content: space-between;
	width: 1000px;
	max-width: 100%;
	gap: 4px;
	cursor: pointer;
	color: ${({ isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return colors.lightRed;
		if (isHighestPatronTier) return colors.tier4;
		return colors.superLightGrey;
	}};
	background-color: ${({ isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return `${colors.darkRed}cc`;
		if (isHighestPatronTier) return `${colors.tier4Darkened}dd`;
		return `${colors.newDarkBlue}bb`;
	}};
	border-bottom: 1px solid
		${({ isDisabled: _d, isHighestPatronTier: _s }) => {
			// if (isDisabled) return colors.darkRed;
			// if (isHighestPatronTier) return colors.tier4Transparent;
			return `${colors.black}88`;
		}};
	border-right: 1px solid
		${({ isDisabled: _d, isHighestPatronTier: _s }) => {
			// if (isDisabled) return colors.darkRed;
			// if (isHighestPatronTier) return colors.tier4Transparent;
			return `${colors.black}88`;
		}};
	border-top: 1px solid
		${({ isDisabled, isHighestPatronTier }) => {
			if (isDisabled) return colors.mediumRed;
			if (isHighestPatronTier) return `${colors.tier4Muted}66`;
			return `${colors.newMediumGrey}99`;
		}};
	border-left: 1px solid
		${({ isDisabled, isHighestPatronTier }) => {
			if (isDisabled) return colors.mediumRed;
			if (isHighestPatronTier) return `${colors.tier4Muted}66`;
			return `${colors.newMediumGrey}99`;
		}};
`;

const StyledLeaderboardsMemberDetailsImages = styled(Flex)`
	flex-direction: row;
	gap: 8px;
`;

const StyledLeaderboardsMemberExpandIcon = styled(Flex)`
	width: 24px;
	height: 100%;
	font-size: 1.5em;
	justify-content: center;
	align-items: center;
	&:hover {
		/* text-shadow: 0 0 10px ${colors.lightGrey}; */
		font-size: 1.7em;
	}
`;

const StyledMemberPosition = styled(Flex)<{ size: Size }>`
	width: ${({ size }) => size - 8}px;
	max-width: 64px;
	font-size: 1.5em;
	@media (max-width: ${media.tablets}) {
		width: 32px;
	}
	@media (max-width: ${media.bigPhones}) {
		display: none;
	}
`;

const StyledLeaderboardsMemberIcons = styled(Flex)`
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	gap: 8px;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledLeaderboardsMemberDetails = styled(Flex)`
	justify-content: space-between;
	box-sizing: border-box;
	overflow: hidden;
	margin: 0 10px;
	width: 100%;
	gap: 8px;
	@media (max-width: ${media.tablets}) {
		max-width: 100%;
		padding: 0 5px;
	}
`;

const StyledLeaderboardsMemberUsername = styled(Flex)`
	align-items: center;
	justify-content: center;
	max-width: 500px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;

	@media (max-width: ${media.tablets}) {
		display: none;
	}

	h4 {
		flex: 1; /* ADJUSTED */
		text-overflow: ellipsis;
		overflow: hidden;
		min-width: 0;
		text-transform: uppercase;
		&:hover {
			color: ${colors.white};
		}
	}
`;
