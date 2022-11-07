import React, { useState, useMemo } from 'react';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';

import { useMemberLeaderboardsSummary } from 'hooks';
import { media, useTheme, ColorTokens } from 'styles';
import { MemberAvatar } from 'containers';
import { Flex, Button, Size } from 'components';

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

export const LeaderboardsMemberSummary = (props: Props): JSX.Element | null => {
	const history = useHistory();
	const { colorTokens } = useTheme();
	const { steamId, position, onShowDetails } = props;
	const [isExpanded, setIsExpanded] = useState(false);

	const {
		memberLeaderboardsSummary: member,
		memberData,
		leaderData,
	} = useMemberLeaderboardsSummary(steamId);

	const size = Size.BIG;

	const infoIcon = useMemo(() => {
		if (member?.isPrivate) return <LeaderboardsMemberIconPrivate />;
		if (Date.now() - new Date(member?.lastUpdated).getTime() > 2592000000)
			return (
				<LeaderboardsMemberIconOutdated lastUpdated={member?.lastUpdated} />
			);
		return <LeaderboardsMemberIconDummy />;
	}, [member]);

	const onShowDetailsClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	): void => {
		setIsExpanded(!isExpanded);
		onShowDetails();
		event.stopPropagation();
	};

	const onShowProfile = () => {
		if (steamId) history.push(`/profile/${steamId}`);
	};

	if (!memberData) return null;
	return (
		<StyledLeaderboardsMemberSummary
			colorTokens={colorTokens}
			isHighestPatronTier={member.isHighestPatronTier}
			isDisabled={member.isDisabled}>
			<StyledLeaderboardsMemberDetailsImages>
				<Flex>
					<StyledMemberPosition align justify size={size}>
						{position}.
					</StyledMemberPosition>
					<MemberAvatar
						member={memberData}
						size={size}
						onClick={onShowProfile}
					/>
				</Flex>
				<StyledLeaderboardsMemberIcons>
					<LeaderboardsMemberIconPatron patronTier={leaderData?.patreonTier} />
				</StyledLeaderboardsMemberIcons>
			</StyledLeaderboardsMemberDetailsImages>
			<StyledLeaderboardsMemberDetails align>
				<Button
					icon={isExpanded ? 'ChevronDown' : 'ChevronUp'}
					size={Size.MEDIUM}
					onClick={onShowDetailsClick}
				/>
				<StyledLeaderboardsMemberUsername
					to={`/profile/${steamId}`}
					colorTokens={colorTokens}>
					<Flex align justify gap={8}>
						<h4>{member.name}</h4>
						{infoIcon}
					</Flex>
				</StyledLeaderboardsMemberUsername>
				<LeaderboardsMemberPoints steamId={steamId} />
			</StyledLeaderboardsMemberDetails>
		</StyledLeaderboardsMemberSummary>
	);
};

type SummaryProps = {
	colorTokens: ColorTokens;
	isDisabled?: boolean;
	isHighestPatronTier?: boolean;
};

const StyledLeaderboardsMemberSummary = styled(Flex)<SummaryProps>`
	justify-content: space-between;
	width: 1000px;
	max-width: 100%;
	gap: 4px;
	color: ${({ colorTokens, isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return colorTokens['semantic-color--error-strong'];
		if (isHighestPatronTier) return colorTokens['semantic-color--tier-4'];
		return colorTokens['core-primary-text'];
	}};
	background-color: ${({ colorTokens, isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return `${colorTokens['semantic-color--error-muted']}cc`;
		if (isHighestPatronTier)
			return `${colorTokens['semantic-color--tier-4--muted']}bb`;
		return `${colorTokens['semantic-color--idle']}bb`;
	}};
	border-bottom: 1px solid
		${({ colorTokens }) => {
			return `${colorTokens['common-color--shadow']}88`;
		}};
	border-right: 1px solid
		${({ colorTokens }) => {
			return `${colorTokens['common-color--shadow']}88`;
		}};
	border-top: 1px solid
		${({ colorTokens, isDisabled, isHighestPatronTier }) => {
			if (isDisabled) return colorTokens['semantic-color--error'];
			if (isHighestPatronTier)
				return `${colorTokens['semantic-color--tier-4--muted']}66`;
			return `${colorTokens['semantic-color--interactive']}99`;
		}};
	border-left: 1px solid
		${({ colorTokens, isDisabled, isHighestPatronTier }) => {
			if (isDisabled) return colorTokens['semantic-color--error'];
			if (isHighestPatronTier)
				return `${colorTokens['semantic-color--tier-4--muted']}66`;
			return `${colorTokens['semantic-color--interactive']}99`;
		}};
`;

const StyledLeaderboardsMemberDetailsImages = styled(Flex)`
	flex-direction: row;
	gap: 8px;
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

const StyledLeaderboardsMemberUsername = styled(Link)<{
	colorTokens: ColorTokens;
}>`
	color: inherit;
	&:hover {
		color: white;
	}
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
			color: ${({ colorTokens }) => colorTokens['semantic-color--link-hover']};
		}
	}
`;
