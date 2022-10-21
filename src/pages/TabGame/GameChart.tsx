import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Game, Badge } from '@masochistme/sdk/dist/v1/types';

import { useGameCompletions } from 'sdk';
import { Flex, Spinner, Warning } from 'components';
import { SubPage, Section, List, BadgeTile } from 'containers';
import { useActiveTab } from 'shared/hooks';
import { TabDict } from 'shared/config/tabs';

import { Bar } from 'react-chartjs-2';

type Props = {
	gameId: number;
};

export const GameChart = (props: Props) => {
	const { gameId } = props;

	const { completionsData } = useGameCompletions({
		filter: { gameId },
		sort: { completionPercentage: 'desc' },
	});

	console.log(completionsData);

	const completions = completionsData.filter(
		c => c.completionPercentage === 100,
	);
	const avgPlaytime =
		completions.reduce((acc, curr) => (acc += curr.playTime), 0) /
		completions.length;

	const gameDetails = {
		completions: completions.length,
		avgPlaytime,
		avgPlaytimeForTier: 0,
	};

	console.log(gameDetails);

	return (
		<Section
			fullWidth
			title={`Completions: ${
				gameDetails.completions ?? 'unknown'
			} - average completion time`}
			content={
				<Bar
					datasetIdKey={`game-completions-${gameId}`}
					data={{
						labels: ['hours'],
						datasets: [
							{
								label: 'this game',
								data: [gameDetails.avgPlaytime],
								colorNormal: '#e30000ff',
								colorTransparent: '#e3000033',
							},
							{
								label: 'games from this tier',
								data: [gameDetails.avgPlaytimeForTier ?? 0],
								colorNormal: '#141620ff',
								colorTransparent: '#14162066',
							},
						],
					}}
				/>
			}
		/>
	);
};
