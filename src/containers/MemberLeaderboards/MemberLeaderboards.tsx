import React from 'react';
import { orderBy } from 'lodash';
import styled from 'styled-components';
import { MemberGame, TierId } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useMemberGames, useMemberById } from 'sdk';
import { media, useTheme, ColorTokens } from 'styles';
import { Flex, Loader, QueryBoundary } from 'components';

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
	const { steamId } = props;

	const lazyGameList = useLazyGamesList(props);
	const { memberData } = useMemberById(steamId);

	const isDisabled = memberData?.isPrivate;

	return (
		<StyledMemberGameList isDisabled={isDisabled} colorTokens={colorTokens}>
			{lazyGameList.map(memberGame => (
				<QueryBoundary fallback={<Loader />}>
					<MemberLeaderboardsGame
						steamId={steamId}
						memberGame={memberGame}
						key={`game-${memberGame.gameId}`}
					/>
				</QueryBoundary>
			))}
		</StyledMemberGameList>
	);
};

const useLazyGamesList = (props: Props) => {
	const { steamId, filter } = props;
	const { gamesData } = useCuratedGames();
	const { memberGamesData } = useMemberGames(steamId);

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

	return lazyGameList;
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
	border-left: 1px solid
		${({ colorTokens }) => colorTokens['core-secondary-bg']};
	border-right: 1px solid
		${({ colorTokens }) => colorTokens['core-secondary-bg']};
	background-color: ${({ isDisabled, colorTokens }) => {
		if (isDisabled) return `${colorTokens['semantic-color--error-muted']}aa`;
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
