import React, { Suspense } from 'react';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import { MemberGame, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useMemberGames, useMemberById } from 'sdk';
import { media, useTheme, ColorTokens } from 'styles';
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
	const { memberData } = useMemberById(steamId);

	const isDisabled = memberData?.isPrivate;

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
		<StyledMemberGameList isDisabled={isDisabled} colorTokens={colorTokens}>
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
	colorTokens: ColorTokens;
};

export const StyledMemberGameList = styled(Flex)<SummaryProps>`
	flex-direction: column;
	transition: height 1s;
	width: 100%;
	box-sizing: border-box;
	background-color: ${({ isDisabled, colorTokens }) => {
		if (isDisabled) return `${colorTokens['semantic-color--error-muted']}aa`;
		return `${colorTokens['core-tertiary-bg']}cc`;
	}};
	&:first-child {
		border-top: none;
	}
	@media (max-width: ${media.smallNetbooks}) {
		padding: 0;
		width: 100%;
	}
`;
