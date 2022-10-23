import React from 'react';
import { Badge, Game, MemberGame, Tier } from '@masochistme/sdk/dist/v1/types';

import { useGameBadges, useGameCompletions, useTiers } from 'sdk';
import { Flex, Skeleton } from 'components';
import { Size } from 'utils';

type Props = {
	game: Game;
};

/**
 * Game table view - cell showing total points of the game
 */

export const CellTotalPoints = (props: Props) => {
	const { game } = props;
	const { gameBadgesData, isLoading, isFetched } = useGameBadges(game?.id);
	const { tiersData } = useTiers();

	const tierPoints =
		tiersData.find((tier: Tier) => tier.id === game?.tier)?.score ?? 0;
	const badgePoints =
		gameBadgesData.reduce((sum: number, badge: Badge) => {
			if (badge.points <= 0) return sum; // We exclude negative point badges
			return sum + badge.points;
		}, 0) ?? 0;

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && badgePoints + tierPoints}
		</Flex>
	);
};

/**
 * Game table view - cell showing total completions of the game
 */

export const CellCompletions = (props: Props) => {
	const { game } = props;
	const { completionsData, isLoading, isFetched } = useGameCompletions({
		filter: { gameId: game?.id },
	});

	const gameCompletions = completionsData.filter(
		completion =>
			completion.gameId === game?.id && completion.completionPercentage === 100,
	);

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && (gameCompletions.length ?? 0)}
		</Flex>
	);
};

/**
 * Game table view - cell showing average playtime of the game
 */

export const CellAvgPlaytime = (props: Props) => {
	const { game } = props;
	const { completionsData, isLoading, isFetched } = useGameCompletions({
		filter: { gameId: game?.id },
	});

	const gameCompletions = completionsData.filter(
		completion =>
			completion.gameId === game?.id && completion.completionPercentage === 100,
	);

	const avgPlaytime =
		gameCompletions.reduce(
			(sum: number, completion: MemberGame) => sum + completion.playTime,
			0,
		) / gameCompletions.length;

	const fixedAvgPlaytime = Number.isNaN(avgPlaytime)
		? '—'
		: `${avgPlaytime.toFixed(2)} h`;

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && (fixedAvgPlaytime ?? 0)}
		</Flex>
	);
};

/**
 * Game table view - cell showing number of game badges
 */

export const CellBadges = (props: Props) => {
	const { game } = props;
	const { gameBadgesData, isLoading, isFetched } = useGameBadges(game?.id);

	return (
		<Flex row align justify>
			{isLoading && <Skeleton size={Size.SMALL} />}
			{isFetched && (gameBadgesData.length > 0 ? gameBadgesData.length : '—')}
		</Flex>
	);
};

/**
 * Game table view - cell showing number of game achievements
 */

export const CellAchievements = (props: Props) => {
	const { game } = props;
	return (
		<Flex row align justify>
			{game.achievementsTotal}
		</Flex>
	);
};
