import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PatronTier } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useLeaderboards } from 'sdk';
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

	const { leaderboardsData } = useLeaderboards();
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
			<StyledMemberPosition align justify size={size}>
				{position}
			</StyledMemberPosition>
			<MemberAvatar member={memberData!} size={size} />
			<Flex column align justifyContent={'space-evenly'} margin="0 4px" gap={8}>
				<LeaderboardsMemberIconPatron patronTier={leaderData?.patreonTier} />
				{infoIcon()}
			</Flex>
			<StyledLeaderboardsMemberDetails align>
				<StyledLeaderboardsMemberExpandIcon onClick={onShowDetailsClick}>
					<i className={`fas fa-chevron-${isExpanded ? 'down' : 'up'}`} />
				</StyledLeaderboardsMemberExpandIcon>
				<StyledLeaderboardsMemberUsername>
					{member.name}
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
	width: 100%;
	min-width: 0;
	overflow: hidden;
	padding: 2px 0;
	gap: 4px;
	cursor: pointer;
	color: ${({ isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return colors.lightRed;
		if (isHighestPatronTier) return colors.tier4;
		return colors.superLightGrey;
	}};
	background-color: ${({ isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return colors.darkRedTransparent;
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
	width: ${({ size }) => size}px;
	max-width: 64px;
	font-size: 1.5em;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledLeaderboardsMemberUsername = styled.h4`
	text-transform: uppercase;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	&:hover {
		color: ${colors.white};
	}
`;

const StyledLeaderboardsMemberDetails = styled(Flex)`
	justify-content: space-between;
	margin: 0 10px;
	width: 90%;
	min-width: 0;
	box-sizing: border-box;
	@media (max-width: ${media.tablets}) {
		max-width: 100%;
		padding: 0 5px;
	}
`;
