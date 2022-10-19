import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useMemberById, useMemberLeaderboards } from 'sdk';
import { colors, media } from 'shared/theme';
import { Flex } from 'components';
import { MemberAvatar } from 'containers';

import { LeaderboardsMemberPoints } from './LeaderboardsMemberPoints';
import {
	LeaderboardsMemberIconPatron,
	LeaderboardsMemberIconPrivate,
	LeaderboardsMemberIconOutdated,
	LeaderboardsMemberIconDummy,
} from './LeaderboardsMemberIcons';
import { Size } from 'utils';

type Props = {
	steamId: string;
	position: number;
	onShowDetails: () => void;
};

export const LeaderboardsMemberSummary = (props: Props): JSX.Element => {
	const history = useHistory();
	const { steamId, position, onShowDetails } = props;
	const [isExpanded, setIsExpanded] = useState(false);

	const { memberData } = useMemberById(steamId);
	const { leaderData } = useMemberLeaderboards(steamId);

	const size = Size.BIG;
	const isDisabled = memberData?.isPrivate;
	const isShekelmaster = leaderData?.patreonTier === 4;

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
			return <LeaderboardsMemberIconOutdated />;
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
			isShekelmaster={isShekelmaster}
			isDisabled={isDisabled}
			onClick={onShowProfile}>
			<StyledMemberPosition align justify size={size}>
				{position}
			</StyledMemberPosition>
			<MemberAvatar member={memberData!} size={size} />
			<Flex column align justifyContent={'space-evenly'} margin="0 4px" gap={8}>
				<LeaderboardsMemberIconPatron patreonTier={leaderData?.patreonTier} />
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
	isShekelmaster?: boolean;
};

const StyledLeaderboardsMemberSummary = styled(Flex)<SummaryProps>`
	width: 100%;
	padding: 2px 0;
	gap: 4px;
	cursor: pointer;
	color: ${({ isDisabled, isShekelmaster }) => {
		if (isDisabled) return colors.lightRed;
		if (isShekelmaster) return colors.tier4;
		return colors.superLightGrey;
	}};
	background-color: ${({ isDisabled, isShekelmaster }) => {
		if (isDisabled) return colors.darkRedTransparent;
		if (isShekelmaster) return colors.tier4Transparent;
		return `${colors.newDarkBlue}bb`;
	}};
	border-bottom: 1px solid
		${({ isDisabled: _d, isShekelmaster: _s }) => {
			// if (isDisabled) return colors.darkRed;
			// if (isShekelmaster) return colors.tier4Transparent;
			return `${colors.black}88`;
		}};
	border-right: 1px solid
		${({ isDisabled: _d, isShekelmaster: _s }) => {
			// if (isDisabled) return colors.darkRed;
			// if (isShekelmaster) return colors.tier4Transparent;
			return `${colors.black}88`;
		}};
	border-top: 1px solid
		${({ isDisabled, isShekelmaster }) => {
			if (isDisabled) return colors.mediumRed;
			if (isShekelmaster) return `${colors.tier4Muted}66`;
			return `${colors.newMediumGrey}99`;
		}};
	border-left: 1px solid
		${({ isDisabled, isShekelmaster }) => {
			if (isDisabled) return colors.mediumRed;
			if (isShekelmaster) return `${colors.tier4Muted}66`;
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

const StyledLeaderboardsMemberUsername = styled(Flex)`
	text-transform: uppercase;
	&:hover {
		color: ${colors.white};
	}
`;

const StyledLeaderboardsMemberDetails = styled(Flex)`
	justify-content: space-between;
	margin: 0 10px;
	width: 100%;
	max-width: 90%;
	@media (max-width: ${media.tablets}) {
		max-width: 100%;
		padding: 0 5px;
	}
`;
