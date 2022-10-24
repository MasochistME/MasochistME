import { useMemo, Suspense } from 'react';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import { MemberGame, PatronTier, TierId } from '@masochistme/sdk/dist/v1/types';

import {
	useCuratedGames,
	useMemberGames,
	useMemberById,
	useMemberLeaderboards,
} from 'sdk';
import { media, colors } from 'shared/theme';
import { Flex, Spinner } from 'components';

import { MemberLeaderboardsGame } from './MemberLeaderboardsGame';

type Props = {
	steamId: string;
	filter?: {
		tiers?: TierId[];
		isHideCompleted?: boolean;
		isHideUnfinished?: boolean;
	};
};

export const MemberLeaderboards = (props: Props): JSX.Element => {
	const { steamId, filter } = props;

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
	const isHighestPatronTier = leaderData?.patreonTier === PatronTier.TIER4;

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

	const filteredGameList = filter
		? gameList.filter(game => {
				let shouldFilter = true;
				if (filter?.tiers) {
					const gameTier = gamesData.find(g => g.id === game.gameId)?.tier;
					shouldFilter = gameTier ? filter.tiers.includes(gameTier) : false;
				}
				if (filter?.isHideCompleted) {
					shouldFilter = shouldFilter && game.completionPercentage !== 100;
				}
				if (filter?.isHideUnfinished) {
					shouldFilter = shouldFilter && game.completionPercentage === 100;
				}
				return shouldFilter;
		  })
		: gameList;

	return (
		<StyledMemberGameList
			isDisabled={isDisabled}
			isHighestPatronTier={isHighestPatronTier}>
			<Suspense
				fallback={
					<Flex align justify padding={16}>
						<Spinner />
					</Flex>
				}>
				{filteredGameList.map(memberGame => (
					<MemberLeaderboardsGame
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
	isHighestPatronTier?: boolean;
};

export const StyledMemberGameList = styled(Flex)<SummaryProps>`
	flex-direction: column;
	transition: height 1s;
	width: 100%;
	box-sizing: border-box;
	border-left: 1px solid ${colors.superDarkGrey};
	border-right: 1px solid ${colors.superDarkGrey};
	background-color: ${({ isDisabled, isHighestPatronTier }) => {
		if (isDisabled) return `${colors.darkRed}aa`;
		if (isHighestPatronTier) return `${colors.tier4Darkened}aa`;
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
