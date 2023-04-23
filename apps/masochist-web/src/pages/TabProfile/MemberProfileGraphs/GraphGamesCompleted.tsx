import React from 'react';

import { useCuratedGames, useMemberGames } from 'sdk';
import { DoughnutChart } from 'containers';

type Props = {
	memberId: string;
};

export const GraphGamesCompleted = (props: Props) => {
	const { memberId } = props;

	const { gamesData } = useCuratedGames();
	const { memberGamesData } = useMemberGames(memberId);

	const memberCompletedGames = memberGamesData
		.filter(memberGame => memberGame.completionPercentage === 100)
		.map(memberGame => {
			const gameTier =
				gamesData.find(g => g.id === memberGame.gameId)?.tier ?? null;
			return gameTier;
		})
		.filter(Boolean);

	const memberCompletedGamesReducedToTiers = memberCompletedGames.reduce(
		(tiersSum, tier) => {
			if (!tier) return tiersSum;
			if (tiersSum[tier]) {
				return {
					...tiersSum,
					[tier]: tiersSum[tier] + 1,
				};
			} else {
				return {
					...tiersSum,
					[tier]: 1,
				};
			}
		},
		{} as any,
	);

	const labels: string[] = Object.keys(memberCompletedGamesReducedToTiers);
	const data: number[] = Object.values(memberCompletedGamesReducedToTiers);
	const datasets = [
		{
			label: 'Completed games',
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
