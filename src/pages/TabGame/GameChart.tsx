import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game, Badge } from '@masochistme/sdk/dist/v1/types';

import { useGameCompletions } from 'sdk';
import { Flex, Spinner, Warning } from 'components';
import { SubPage, Section, List, BadgeTile } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { BarChart } from 'containers/Charts/BarChart';

type Props = {
	gameId: number;
	title: string;
};

export const GameChart = (props: Props) => {
	const { gameId, title } = props;

	const { completionsData } = useGameCompletions({
		filter: { gameId },
		sort: { completionPercentage: 'desc' },
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
		<Section
			fullWidth
			title={`Completions: ${
				gameCompletions?.length ?? 'unknown'
			} • Average completion time: ${gameAvgPlaytime} h`}
			content={
				<BarChart
					datasetIdKey={`game-completions-${gameId}`}
					options={{
						indexAxis: 'y',
						aspectRatio: 8,
						scales: {
							x: { stacked: true },
							y: { stacked: true },
						},
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
	);
};
