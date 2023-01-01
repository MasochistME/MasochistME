import React from 'react';
import { useHistory } from 'react-router-dom';
import { Game, GameLeaderboards, Tier } from '@masochistme/sdk/dist/v1/types';

import { useTiers, useLeaderboardsGames } from 'sdk';
import { useTheme } from 'styles';
import { getTierIcon } from 'utils';
import { Flex, Icon, Skeleton, Size, TableLink } from 'components';
import { GameThumbnail } from 'containers';

type Props = { game: Game };

/**
 * Cell showing tier of the game
 */
export const CellTier = (props: Props) => {
	const { game } = props;
	const { tiersData } = useTiers();

	return (
		<Flex align justify>
			<Icon icon={getTierIcon(game.tier, tiersData)} />
		</Flex>
	);
};

/**
 * Cell showing title of the game
 */
export const CellTitle = (props: Props) => {
	const { game } = props;
	const { colorTokens } = useTheme();
	const history = useHistory();

	const onGameClick = (game: Game) => {
		if (game?.id) history.push(`/game/${game.id}`);
	};
	return (
		<Flex align textAlign="left" gap={4}>
			<GameThumbnail game={game} size={Size.MEDIUM} />
			<TableLink colorTokens={colorTokens} onClick={() => onGameClick(game)}>
				{game.title}
			</TableLink>
		</Flex>
	);
};

/**
 * Cell showing current discount of the game
 */
export const CellSale = (props: Props) => {
	const { game } = props;
	const sale = game.sale ? `${game.sale}%` : '—';
	return (
		<Flex row align justify>
			{sale}
		</Flex>
	);
};

/**
 * Cell showing total points of the game (including badges with non-negative values)
 */
export const CellTotalPoints = (props: Props) => {
	const { game } = props;
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();
	const { tiersData } = useTiers();
	const gameTotalPoints = getGameTotalPoints(game, leaderboardsData, tiersData);

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && gameTotalPoints}
		</Flex>
	);
};

/**
 * Cell showing number of badges of the game
 */
export const CellBadges = (props: Props) => {
	const { game } = props;
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();
	const gameBadgeNumber = getGameBadges(game, leaderboardsData);
	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && gameBadgeNumber}
		</Flex>
	);
};

/**
 * Cell showing number of completions of the game
 */
export const CellCompletions = (props: Props) => {
	const { game } = props;
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();
	const gameCompletions = getGameCompletions(game, leaderboardsData);

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && gameCompletions}
		</Flex>
	);
};

/**
 * Cell showing number of owners of the game
 */
export const CellOwners = (props: Props) => {
	const { game } = props;
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();
	const gameOwners = getGameOwners(game, leaderboardsData);
	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && gameOwners}
		</Flex>
	);
};

/**
 * Cell showing average playtime of the game
 */
export const CellAvgPlaytime = (props: Props) => {
	const { game } = props;
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();
	const avgPlaytime = getGameAvgPlaytime(game, leaderboardsData);

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && avgPlaytime}
		</Flex>
	);
};

/**
 * Cell showing date of latest completion of the game
 */
export const CellLatestCompletion = (props: Props) => {
	const { game } = props;
	const { leaderboardsData, isLoading, isFetched } = useLeaderboardsGames();
	const latestGameCompletion = getGameLatestCompletion(game, leaderboardsData);

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && latestGameCompletion}
		</Flex>
	);
};

/**
 * *************************************
 * * ************* HOOKS ************* *
 * *************************************
 */

export const getGameTotalPoints = (
	game: Game,
	leaderboardsData: GameLeaderboards[],
	tiersData: Tier[],
) => {
	const hasAchievements = game.achievementsTotal !== 0;
	const ptsBadges =
		leaderboardsData.find(l => l.gameId === game?.id)?.badges?.points ?? 0;
	const ptsTiers = hasAchievements
		? tiersData.find((tier: Tier) => tier.id === game.tier)?.score ?? 0
		: 0;
	const gameTotalPoints = ptsBadges + ptsTiers;

	return gameTotalPoints;
};

export const getGameBadges = (
	game: Game,
	leaderboardsData: GameLeaderboards[],
) => {
	const gameBadgeNumber =
		leaderboardsData.find(l => l.gameId === game?.id)?.badges?.total ?? 0;

	return gameBadgeNumber;
};

export const getGameCompletions = (
	game: Game,
	leaderboardsData: GameLeaderboards[],
) => {
	const gameCompletions =
		leaderboardsData.find(l => l.gameId === game?.id)?.completions?.base ?? 0;

	return gameCompletions;
};

export const getGameOwners = (
	game: Game,
	leaderboardsData: GameLeaderboards[],
) => {
	const gameOwners =
		leaderboardsData.find(l => l.gameId === game?.id)?.owners ?? 0;

	return gameOwners;
};

export const getGameAvgPlaytime = (
	game: Game,
	leaderboardsData: GameLeaderboards[],
) => {
	const rawAvgPlaytime = leaderboardsData.find(
		l => l.gameId === game?.id,
	)?.avgPlaytime;
	const avgPlaytime =
		!rawAvgPlaytime || Number.isNaN(rawAvgPlaytime)
			? 0
			: Math.round(rawAvgPlaytime);

	return avgPlaytime;
};

export const getGameLatestCompletion = (
	game: Game,
	leaderboardsData: GameLeaderboards[],
) => {
	const getLatestGameCompletion = (game: Game) => {
		const gameLatestCompletion = leaderboardsData.find(
			l => l.gameId === game?.id,
		)?.times?.newestCompletion;
		return new Date(gameLatestCompletion ?? 0).getTime();
	};

	const getLatestGameCompletionLocale = (game: Game) => {
		const date = getLatestGameCompletion(game);
		if (!date) return 'never';
		return new Date(date).toLocaleDateString();
	};

	return getLatestGameCompletionLocale(game);
};
