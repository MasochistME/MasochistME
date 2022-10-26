import React, { useMemo, Suspense } from 'react';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import { MemberGame, PatronTier, TierId } from '@masochistme/sdk/dist/v1/types';

import {
	useCuratedGames,
	useMemberGames,
	useMemberById,
	useMemberLeaderboards,
} from 'sdk';
import { media, colors } from 'styles/theme/themeOld';
import { useTheme, ColorTokens } from 'styles';
import { Flex, Loader, Skeleton } from 'components';

const MemberLeaderboardsGame = React.lazy(() =>
	import('./MemberLeaderboardsGame').then(module => ({
		default: module.MemberLeaderboardsGame,
	})),
);

type Props = {
	steamId: string;
	filter?: {
		tiers?: TierId[];
		isHideCompleted?: boolean;
		isHideUnfinished?: boolean;
	};
};

export const MemberLeaderboards = (props: Props): JSX.Element => {
	const { colorTokens } = useTheme();
	const { steamId, filter } = props;

	const { gamesData } = useCuratedGames();
	const { memberGamesData, isLoading, isFetched } = useMemberGames(steamId);
	const { leaderData } = useMemberLeaderboards(steamId);
	const { memberData } = useMemberById(steamId);

	const isDisabled = memberData?.isPrivate;
	const isHighestPatronTier = leaderData?.patreonTier === PatronTier.TIER4;

	const lazyGameList: MemberGame[] = orderBy(
		memberGamesData.filter(memberGame => {
			const game = gamesData.find(g => g.id === memberGame.gameId);
			if (game && (game.isCurated || game.isProtected)) return true;
			return false;
		}),
		['completionPercentage', 'mostRecentAchievementDate'],
		['desc', 'desc'],
	).filter(game => {
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
	});

	return (
		<StyledMemberGameList
			isDisabled={isDisabled}
			isHighestPatronTier={isHighestPatronTier}
			colorTokens={colorTokens}>
			{isLoading && <Loader />}
			{isFetched &&
				lazyGameList.map(memberGame => (
					<Suspense
						key={`game-${memberGame.gameId}`}
						fallback={
							<Skeleton
								width="100%"
								height="20px"
								style={{ margin: '1px 0' }}
							/>
						}>
						<MemberLeaderboardsGame steamId={steamId} memberGame={memberGame} />
					</Suspense>
				))}
		</StyledMemberGameList>
	);
};

type SummaryProps = {
	isDisabled?: boolean;
	isHighestPatronTier?: boolean;
	colorTokens: ColorTokens;
};

export const StyledMemberGameList = styled(Flex)<SummaryProps>`
	flex-direction: column;
	transition: height 1s;
	width: 100%;
	box-sizing: border-box;
	border-left: 1px solid
		${({ colorTokens }) => colorTokens['core-secondary-bg']};
	border-right: 1px solid
		${({ colorTokens }) => colorTokens['core-secondary-bg']};
	background-color: ${({ isDisabled, isHighestPatronTier, colorTokens }) => {
		if (isDisabled) return `${colorTokens['semantic-color-error-muted']}aa`;
		if (isHighestPatronTier) return `${colors.tier4Darkened}aa`;
		return `${colorTokens['core-secondary-bg']}cc`;
	}};
	&:first-child {
		border-top: none;
	}
	@media (max-width: ${media.smallNetbooks}) {
		padding: 0;
		width: 100%;
	}
`;
