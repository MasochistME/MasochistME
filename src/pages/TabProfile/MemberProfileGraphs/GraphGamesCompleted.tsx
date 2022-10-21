import React from 'react';
import { orderBy } from 'lodash';
import moment from 'moment';
import { Tier, Game, Member } from '@masochistme/sdk/dist/v1/types';

import { useCuratedGames, useTiers, useMemberById, useMemberGames } from 'sdk';
import { Section, DoughnutChart, LineChart } from 'containers';
import { log } from 'utils';
import { Flex, Spinner } from 'components';

type Props = {
	memberId: string;
};

export const GraphGamesCompleted = (props: Props) => {
	const { memberId } = props;

	const { tiersData } = useTiers();
	const { gamesData } = useCuratedGames();
	const {
		memberGamesData,
		isLoading: isMemberGamesLoading,
		isFetched: isMemberGamesFetched,
	} = useMemberGames(memberId);

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
