import React from 'react';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import { MemberGame, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useMemberGames } from 'sdk';
import { media, useTheme, ColorTokens } from 'styles';
import { Flex, Skeleton, QueryBoundary, ErrorFallback } from 'components';

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
	const { colorTokens } = useTheme();
	return (
		<StyledMemberGameList colorTokens={colorTokens}>
			<QueryBoundary
				fallback={<MemberLeaderboardsSkeleton />}
				errorFallback={<ErrorFallback />}>
				<MemberLeaderboardsBoundary {...props} />
			</QueryBoundary>
		</StyledMemberGameList>
	);
};

const MemberLeaderboardsBoundary = (props: Props) => {
	const filteredGames = useFilteredGames(props);
	return (
		<>
			{filteredGames.map(memberGame => (
				<MemberLeaderboardsGame
					steamId={props.steamId}
					memberGame={memberGame}
					key={`game-${memberGame.gameId}`}
				/>
			))}
		</>
	);
};

const MemberLeaderboardsSkeleton = () => (
	<Flex column gap={2}>
		{new Array(5).fill(null).map(() => (
			<Skeleton width="100%" height="3.2rem" />
		))}
	</Flex>
);

const useFilteredGames = (props: Props) => {
	const { steamId, filter } = props;
	const { gamesData } = useCuratedGames();
	const { memberGamesData } = useMemberGames(steamId);

	const filteredGames: MemberGame[] = orderBy(
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

	return filteredGames;
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
