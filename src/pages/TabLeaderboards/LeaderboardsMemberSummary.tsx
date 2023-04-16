import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Variant } from 'components/Button/types';

type Props = {
	steamId: string;
	position: number;
	onShowDetails: () => void;
};

export const LeaderboardsMemberSummary = (props: Props): JSX.Element | null => {
	const navigate = useNavigate();
	const { colorTokens } = useTheme();
	const { steamId, position, onShowDetails } = props;
	const [isExpanded, setIsExpanded] = useState(false);

	const {
		memberLeaderboardsSummary: member,
		memberData,
		leaderData,
	} = useMemberLeaderboardsSummary(steamId);

	const size = Size.BIG;
	const variant = member.isHighestPatronTier ? Variant.GOLDEN : Variant.DEFAULT;

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
		if (steamId) navigate(`/profile/${steamId}`);
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
					variant={variant}
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
	width: 100rem;
	max-width: 100%;
	gap: var(--size-4);
	color: ${({ colorTokens, isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return colorTokens['semantic-color--error-strong'];
		if (isHighestPatronTier) return colorTokens['semantic-color--tier-4'];
		return colorTokens['core-primary-text'];
	}};
	background-color: ${({ colorTokens, isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return `${colorTokens['semantic-color--error-muted']}cc`;
		if (isHighestPatronTier)
			return `${colorTokens['semantic-color--tier-4--muted']}aa`;
		return `${colorTokens['semantic-color--idle']}bb`;
	}};
	border-bottom: var(--size-1) solid
		${({ colorTokens, isHighestPatronTier }) => {
			if (isHighestPatronTier)
				return `${colorTokens['common-color--shadow']}88`;
			return `${colorTokens['common-color--shadow']}88`;
		}};
	border-right: var(--size-1) solid
		${({ colorTokens, isHighestPatronTier }) => {
			if (isHighestPatronTier)
				return `${colorTokens['common-color--shadow']}88`;
			return `${colorTokens['common-color--shadow']}88`;
		}};
	border-top: var(--size-1) solid
		${({ colorTokens, isDisabled, isHighestPatronTier }) => {
			if (isDisabled) return `${colorTokens['semantic-color--error']}b8`;
			if (isHighestPatronTier)
				return `${colorTokens['semantic-color--tier-4']}88`;
			return `${colorTokens['semantic-color--interactive']}99`;
		}};
	border-left: var(--size-1) solid
		${({ colorTokens, isDisabled, isHighestPatronTier }) => {
			if (isDisabled) return `${colorTokens['semantic-color--error']}b8`;
			if (isHighestPatronTier)
				return `${colorTokens['semantic-color--tier-4']}88`;
			return `${colorTokens['semantic-color--interactive']}99`;
		}};
`;

const StyledLeaderboardsMemberDetailsImages = styled(Flex)`
	flex-direction: row;
	gap: var(--size-8);
`;

const StyledMemberPosition = styled(Flex)<{ size: Size }>`
	width: ${({ size }) => size - 0.8}rem;
	max-width: var(--size-64);
	font-size: var(--font-size-16);
	@media (max-width: ${media.tablets}) {
		width: var(--size-32);
	}
	@media (max-width: ${media.bigPhones}) {
		display: none;
	}
`;

const StyledLeaderboardsMemberIcons = styled(Flex)`
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	gap: var(--size-8);
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledLeaderboardsMemberDetails = styled(Flex)`
	justify-content: space-between;
	box-sizing: border-box;
	overflow: hidden;
	margin: 0 var(--size-10);
	width: 100%;
	gap: var(--size-8);
	@media (max-width: ${media.tablets}) {
		max-width: 100%;
		padding: 0 var(--size-5);
	}
`;

const StyledLeaderboardsMemberUsername = styled(Link)<{
	colorTokens: ColorTokens;
}>`
	color: inherit;
	&:hover {
		color: white;
	}
	max-width: 50rem;
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
