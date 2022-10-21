import React, { useMemo, Suspense } from 'react';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import { MemberGame } from '@masochistme/sdk/dist/v1/types';

import {
	useCuratedGames,
	useMemberGames,
	useMemberById,
	useMemberLeaderboards,
} from 'sdk';
import { media, colors } from 'shared/theme';
import { Flex, Spinner } from 'components';

import { LeaderboardsMemberGame } from './LeaderboardsMemberGame';

type Props = {
	steamId: string;
};

export const LeaderboardsMemberCollapse = (props: Props): JSX.Element => {
	const { steamId } = props;

	const {
		gamesData,
		isLoading: isGamesLoading,
		isFetched: isGamesFetched,
	} = useCuratedGames();
	const {
		memberGamesData,
		isLoading: isMemberGamesLoading,
		isFetched: isMemberGamesFetched,
	} = useMemberGames(steamId);
	const { leaderData } = useMemberLeaderboards(steamId);
	const { memberData } = useMemberById(steamId);

	const isFetched = isGamesFetched && isMemberGamesFetched;
	const isLoading = isGamesLoading && isMemberGamesLoading;

	const isDisabled = memberData?.isPrivate;
	const isShekelmaster = leaderData?.patreonTier === 4;

	const gameList = useMemo(() => {
		const sortedMemberGames: MemberGame[] = orderBy(
			memberGamesData.filter(memberGame => {
				const game = gamesData.find(g => g.id === memberGame.gameId);
				if (game && (game.isCurated || game.isProtected)) return true;
				return false;
			}),
			['completionPercentage', 'mostRecentAchievementDate'],
			['desc', 'desc'],
		);
		return sortedMemberGames;
	}, [gamesData, memberGamesData]);

	return (
		<StyledMemberGameList
			isDisabled={isDisabled}
			isShekelmaster={isShekelmaster}>
			<Suspense
				fallback={
					<Flex align justify padding={16}>
						<Spinner />
					</Flex>
				}>
				{gameList.map(memberGame => (
					<LeaderboardsMemberGame
						key={`game-${memberGame.gameId}`}
						steamId={steamId}
						memberGame={memberGame}
					/>
				))}
			</Suspense>
		</StyledMemberGameList>
	);
};

type SummaryProps = {
	isDisabled?: boolean;
	isShekelmaster?: boolean;
};

export const StyledMemberGameList = styled(Flex)<SummaryProps>`
	flex-direction: column;
	transition: height 1s;
	width: 100%;
	box-sizing: border-box;
	border-left: 1px solid ${colors.superDarkGrey};
	border-right: 1px solid ${colors.superDarkGrey};
	background-color: ${({ isDisabled, isShekelmaster }) => {
		if (isDisabled) return `${colors.darkRedTransparent}cc`;
		if (isShekelmaster) return `${colors.tier4Darkened}aa`;
		return `${colors.superDarkGrey}cc`;
	}};
	&:first-child {
		border-top: none;
	}
	@media (max-width: ${media.smallNetbooks}) {
		padding: 0;
		width: 100%;
	}
`;
