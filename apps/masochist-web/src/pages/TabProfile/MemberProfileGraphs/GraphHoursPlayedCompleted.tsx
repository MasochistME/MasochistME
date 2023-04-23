import React from 'react';

import { useCuratedGames, useTiers, useMemberGames } from 'sdk';
import { DoughnutChart } from 'containers';

type Props = {
	memberId: string;
};

export const GraphHoursPlayedCompleted = (props: Props) => {
	const { memberId } = props;

	const { tiersData } = useTiers();
	const { gamesData } = useCuratedGames();
	const { memberGamesData } = useMemberGames(memberId);

	const memberGamesWithTiers = memberGamesData
		.filter(memberGame => memberGame.completionPercentage === 100)
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
