import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Member, MemberGame } from '@masochistme/sdk/dist/v1/types';

import { useGameCompletion, GameCompletion } from 'hooks';
import {
	DateBlock,
	ErrorFallback,
	Flex,
	ProgressBar,
	QueryBoundary,
	Skeleton,
} from 'components';
import { MemberBadges, MemberAvatar } from 'containers';
import { ColorTokens, useTheme, media } from 'styles';
import { Size } from 'components';
import { useAppContext } from 'context';

type Completion = Omit<MemberGame, '_id' | 'memberId' | 'playtime'> & {
	member: Member;
	trophy: null;
};

type Props = {
	gameId: number;
	isCompact?: boolean;
};

export const GameLeaderboards = (props: Props) => (
	<QueryBoundary
		fallback={<GameLeaderboardsSkeleton />}
		errorFallback={<ErrorFallback />}>
		<GameLeaderboardsBoundary {...props} />
	</QueryBoundary>
);

const GameLeaderboardsBoundary = (props: Props) => {
	const { gameId, isCompact } = props;
	const { colorTokens } = useTheme();
	const { dev } = useAppContext();
	const navigate = useNavigate();

	const { gameCompletions } = useGameCompletion(gameId);

	const assignDateIfFinished = (memberCompletion: Completion) => {
		if (memberCompletion.completionPercentage === 100)
			return <DateBlock date={memberCompletion.mostRecentAchievementDate} />;
		else return <DateBlock date={undefined} />;
	};

	const onMemberClick = (id?: string) => id && navigate(`/profile/${id}`);

	const leaderboardsList = gameCompletions.map(
		(memberCompletion: GameCompletion) => {
			if (!memberCompletion) return null;
			return (
				<StyledGameLeaderboardsMember
					isCompact={isCompact}
					colorTokens={colorTokens}
					key={`leaderboards-member-${memberCompletion.member.steamId}`}>
					{!isCompact && (
						<StyledGameLeaderboardsMemberTime colorTokens={colorTokens}>
							{assignDateIfFinished(memberCompletion)}
						</StyledGameLeaderboardsMemberTime>
					)}
					<MemberAvatar
						member={memberCompletion.member}
						size={isCompact ? Size.SMALL : Size.MEDIUM}
						onClick={() => onMemberClick(memberCompletion.member.steamId)}
					/>
					<StyledGameLeaderboardsMemberInfo align>
						<StyledGameLeaderboardsMemberUsername isCompact={isCompact}>
							{memberCompletion.trophy}
							<Link
								colorTokens={colorTokens}
								onClick={() => onMemberClick(memberCompletion.member.steamId)}>
								{memberCompletion.member.name}
							</Link>
						</StyledGameLeaderboardsMemberUsername>
						{!isCompact && (
							<Flex>
								<MemberBadges
									size={Size.SMALL}
									memberId={memberCompletion.member.steamId}
									gameId={gameId}
								/>
							</Flex>
						)}
					</StyledGameLeaderboardsMemberInfo>
					<ProgressBar
						percentage={Math.floor(memberCompletion.completionPercentage)}
					/>
					{dev > 10 && (
						<span style={{ width: '8rem', textAlign: 'right' }}>
							{memberCompletion.playTime} h
						</span>
					)}
				</StyledGameLeaderboardsMember>
			);
		},
	);

	return (
		<StyledGameLeaderboards column colorTokens={colorTokens}>
			{leaderboardsList}
		</StyledGameLeaderboards>
	);
};

const GameLeaderboardsSkeleton = () => {
	const { colorTokens } = useTheme();
	return (
		<StyledGameLeaderboards column colorTokens={colorTokens}>
			{new Array(10).fill(null).map((_: null, i: number) => (
				<StyledGameLeaderboardsMember
					isCompact
					colorTokens={colorTokens}
					key={i}>
					<Skeleton width="100%" height="4.8rem" />
				</StyledGameLeaderboardsMember>
			))}
		</StyledGameLeaderboards>
	);
};

const StyledGameLeaderboards = styled(Flex)<{ colorTokens: ColorTokens }>`
	width: 100%;
	box-sizing: border-box;
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']}cc;
`;

const StyledGameLeaderboardsMember = styled(Flex)<{
	isCompact?: boolean;
	colorTokens: ColorTokens;
}>`
	max-width: 100%;
	align-items: center;
	&:not(:first-child) {
		border-top: var(--size-1) solid
			${({ colorTokens }) => colorTokens['semantic-color--interactive']};
	}
	&:not(:last-child) {
		border-bottom: var(--size-1) solid
			${({ colorTokens }) => colorTokens['core-primary-bg']};
	}
`;

const StyledGameLeaderboardsMemberInfo = styled(Flex)`
	width: 100%;
	padding: 0 var(--size-10);
	justify-content: space-between;
	overflow: hidden;
	@media (max-width: ${media.smallTablets}) {
		justify-content: flex-end;
	}
`;

const StyledGameLeaderboardsMemberUsername = styled.div<{
	isCompact?: boolean;
}>`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: bold;
	font-size: ${({ isCompact }) =>
		isCompact ? 'var(--font-size-14)' : 'var(--font-size-16)'};
	@media (max-width: ${media.smallTablets}) {
		display: none;
	}
`;

const StyledGameLeaderboardsMemberTime = styled.div<{
	colorTokens: ColorTokens;
}>`
	display: flex;
	align-items: center;
	font-family: var(--font-verdana);
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	width: var(--size-128);
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const Link = styled.span<{ colorTokens: ColorTokens }>`
	cursor: pointer;
	&:hover {
		color: ${({ colorTokens }) => colorTokens['semantic-color--link-hover']};
	}
`;
