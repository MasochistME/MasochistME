import React from 'react';

import { useCuratedGames, useTiers, useMemberGames } from 'sdk';
import { DoughnutChart } from 'containers';

type Props = {
	memberId: string;
};

export const GraphHoursPlayedTotal = (props: Props) => {
	const { memberId } = props;

	const { tiersData } = useTiers();
	const { gamesData } = useCuratedGames();
	const { memberGamesData } = useMemberGames(memberId);

	const memberGamesWithTiers = memberGamesData
		.map(memberGame => {
			const gameTier =
				gamesData.find(g => g.id === memberGame.gameId)?.tier ?? null;
			if (!gameTier) return undefined;
			const tier = tiersData.find(t => t.id === gameTier)?.id ?? null;
			if (!tier) return undefined;
			return { ...memberGame, tier };
		})
		.filter(Boolean);

	const memberGamesReducedToTiers = memberGamesWithTiers.reduce(
		(tiersSum, game) => {
			if (!game) return tiersSum;
			const gameTier = game.tier;
			if (tiersSum[gameTier]) {
				return {
					...tiersSum,
					[gameTier]: tiersSum[gameTier] + Math.round(game.playTime),
				};
			} else {
				return {
					...tiersSum,
					[gameTier]: Math.round(game.playTime),
				};
			}
		},
		{} as any,
	);

	const labels: string[] = Object.keys(memberGamesReducedToTiers);
	const data: number[] = Object.values(memberGamesReducedToTiers);
	const datasets = [
		{
			label: 'Hours played total',
			data,
		},
	];

	return (
		<DoughnutChart
			datasetIdKey={`member-${memberId}-hourstotal`}
			axisOptions={{ stacked: true }}
			options={{
				plugins: {
					legend: {
						display: false,
					},
				},
			}}
			data={{
				labels,
				datasets,
			}}
		/>
	);
};

/**
 *
 */
// const summarizeTotalTimes = (
// 	type: string,
// 	scope: string,
// 	tiers: Tier[],
// 	_member: Member,
// 	games: Game[],
// ) => {
// 	tiers.map((tier: Tier) =>
// 		data.push({
// 			sum: 0,
// 			label: tier.symbol,
// 			id: tier.id,
// 		}),
// 	);

// 	if (scope === 'completed') {
// 		memberGames = memberGames.filter((game: any) => game.percentage === 100);
// 	}

// 	memberGames
// 		.filter((game: any) => games.find((g: Game) => g.id === game.id))
// 		.map((game: any) => {
// 			game = {
// 				...game,
// 				tier: games.find((g: Game) => g.id === game.id)?.tier,
// 			};
// 			const index = data.findIndex((d: any) => d.id === game.tier);
// 			if (data[index]?.sum) data[index].sum += game.playtime;
// 			return game;
// 		});

// 	return data.map((d: any) =>
// 		typeof d[type] === 'number' ? Math.floor(d[type]) : d[type],
// 	);
// };
