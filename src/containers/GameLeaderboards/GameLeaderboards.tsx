import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Member, MemberGame } from '@masochistme/sdk/dist/v1/types';

import { useCuratorMembers, useGameCompletions } from 'sdk';
import { DateBlock, Flex, ProgressBar } from 'components';
import { MemberBadges, MemberAvatar } from 'containers';
import { colors, media, fonts } from 'styles/theme/themeOld';
import { Size } from 'components';

type Completion = Omit<MemberGame, '_id' | 'memberId' | 'playtime'> & {
	member: Member;
	trophy: null;
};

type Props = {
	gameId: number;
	isCompact?: boolean;
};

export const GameLeaderboards = (props: Props) => {
	const { gameId, isCompact } = props;
	const history = useHistory();

	const { membersData } = useCuratorMembers();
	const { completionsData } = useGameCompletions({
		filter: { gameId },
		sort: {
			completionPercentage: 'desc',
			mostRecentAchievementDate: 'asc',
		},
	});

	const leaderboards = completionsData
		.map((completion: MemberGame) => {
			const member = membersData.find(
				(m: Member) => m.steamId === completion.memberId,
			);
			if (!member) return;
			return {
				member: member,
				gameId: completion.gameId,
				mostRecentAchievementDate: completion.mostRecentAchievementDate,
				completionPercentage: completion.completionPercentage,
				trophy: null,
			} as unknown as Completion;
		})
		.filter(Boolean);

	const assignDateIfFinished = (memberCompletion: Completion) => {
		if (memberCompletion.completionPercentage === 100)
			return <DateBlock date={memberCompletion.mostRecentAchievementDate} />;
		else return <DateBlock date={undefined} />;
	};

	const onMemberClick = (id?: string) => id && history.push(`/profile/${id}`);

	const leaderboardsList = leaderboards.map(memberCompletion => {
		if (!memberCompletion) return null;
		return (
			<StyledGameLeaderboardsMember
				isCompact={isCompact}
				key={`leaderboards-member-${memberCompletion.member.steamId}`}>
				{!isCompact && (
					<StyledGameLeaderboardsMemberTime>
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
			</StyledGameLeaderboardsMember>
		);
	});

	return (
		<StyledGameLeaderboards column>{leaderboardsList}</StyledGameLeaderboards>
	);
};

const StyledGameLeaderboards = styled(Flex)`
	width: 100%;
	box-sizing: border-box;
	background-color: ${colors.superDarkGrey}cc;
`;

const StyledGameLeaderboardsMember = styled(Flex)<{ isCompact?: boolean }>`
	max-width: 100%;
	align-items: center;
	&:not(:first-child) {
		border-top: 1px solid ${colors.newMediumGrey};
	}
	&:not(:last-child) {
		border-bottom: 1px solid ${colors.newDark};
	}
`;

const StyledGameLeaderboardsMemberInfo = styled(Flex)`
	width: 100%;
	padding: 0 10px;
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
	font-size: ${({ isCompact }) => (isCompact ? '1em' : '1.2em')};
	@media (max-width: ${media.smallTablets}) {
		display: none;
	}
`;

const StyledGameLeaderboardsMemberTime = styled.div`
	display: flex;
	align-items: center;
	font-size: 0.7em;
	font-family: ${fonts.Verdana};
	color: ${colors.superLightGrey};
	width: 128px;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const Link = styled.span`
	cursor: pointer;
	&:hover {
		color: ${colors.white};
	}
`;
