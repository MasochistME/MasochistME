import React from 'react';

import { useGameCompletions } from 'sdk';
import { Section, BarChart } from 'containers';
import { Flex } from 'components';

type Props = {
	gameId: number;
	title: string;
};

export const GameProfileGraphs = (props: Props) => {
	const { gameId, title } = props;

	const { completionsData } = useGameCompletions({
		filter: { gameId },
	});

	const gameCompletions = completionsData.filter(
		c => c.completionPercentage === 100,
	);

	const gameAvgPlaytime = Math.round(
		gameCompletions.reduce((acc, curr) => (acc += curr.playTime), 0) /
			gameCompletions.length,
	);

	const tierAvgPlaytime = 100; // TODO fake data

	return (
		<Flex justify flexWrap="wrap" width="100%" gap={16}>
			<Section
				fullWidth
				title={`Completions: ${
					gameCompletions?.length ?? '—'
				} • Average completion time: ${gameAvgPlaytime} h`}
				content={
					<BarChart
						datasetIdKey={`game-completions-${gameId}`}
						axisOptions={{ stacked: true }}
						options={{
							indexAxis: 'y',
							aspectRatio: 8,
						}}
						data={{
							labels: ['Average hours to completion'],
							datasets: [
								{
									label: title,
									data: [gameAvgPlaytime],
									borderColor: '#9e1919',
									backgroundColor: '#9e191986',
								},
								{
									label: 'Other games from this tier',
									data: [tierAvgPlaytime],
									borderColor: '#37458a',
									backgroundColor: '#1a2047b8',
								},
							],
						}}
					/>
				}
			/>
		</Flex>
	);
};
