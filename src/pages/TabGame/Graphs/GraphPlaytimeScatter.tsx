import {
	BoxPlotController,
	BoxAndWiskers,
} from '@sgratzl/chartjs-chart-boxplot';
import {
	Chart as ChartJS,
	registerables,
	CategoryScale,
	LinearScale,
	BarElement,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

import { useGameCompletions } from 'sdk';
import { Section } from 'containers';
import { ErrorFallback, Flex, Loader, QueryBoundary } from 'components';
import { useTheme } from 'styles';

ChartJS.register(
	...registerables,
	CategoryScale,
	LinearScale,
	BarElement,
	BoxPlotController,
	BoxAndWiskers,
);
ChartJS.defaults.color = 'white';
ChartJS.defaults.font.size = 14;
ChartJS.defaults.font.family = '"Raleway", "Verdana", sans-serif';

type Props = {
	gameId: number;
};
export const GraphPlaytimeScatter = (props: Props) => {
	const { gameId } = props;
	return (
		<Section
			fullWidth
			maxHeight="350px"
			title={`Playtime (h) - interquartile range`}
			content={
				<QueryBoundary fallback={<Loader />} errorFallback={<ErrorFallback />}>
					<Flex column>
						<div>
							The interquartile range (IQR) is the difference between the first
							quartile and third quartile (indicated by the closed box). Any
							value not fitting within the upper and lower bounds (whishers of
							the box plot) are considered outliers.
						</div>
						<div>Yellow triangle indicates the mean value.</div>
						<Graph gameId={gameId} />
					</Flex>
				</QueryBoundary>
			}
		/>
	);
};

const Graph = ({ gameId }: Props) => {
	const { colorTokens } = useTheme();
	const { completionsData } = useGameCompletions({
		filter: { gameId },
	});

	const completions = completionsData
		.filter(c => c.completionPercentage === 100 && c.playTime !== 0)
		.map(completion => Math.ceil(completion.playTime));
	const data = {
		labels: ['Playtime (h)'],
		datasets: [
			{
				data: [completions.sort((a, b) => b - a)],

				// ITEM
				itemStyle: 'circle',
				itemBackgroundColor: 'transparent',
				// itemBackgroundColor: `${colorTokens['core-primary-text']}22`,
				itemBorderColor: `${colorTokens['core-primary-text']}22`,
				itemRadius: 4,
				itemBorderWidth: 1,
				// OUTLIER
				outlierStyle: 'circle',
				outlierBackgroundColor: `${colorTokens['semantic-color--error']}55`,
				outlierBorderColor: `${colorTokens['core-primary-text']}22`,
				outlierRadius: 4,
				outlierBorderWidth: 1,
				// MEAN
				meanStyle: 'triangle',
				meanBackgroundColor: `${colorTokens['semantic-color--warning']}22`,
				meanBorderColor: colorTokens['semantic-color--warning-strong'],
				meanRadius: 7,
				meanBorderWidth: 1,
				// BOX
				backgroundColor: `${colorTokens['semantic-color--interactive']}cc`,
				borderColor: colorTokens['core-primary-bg'],
				borderWidth: 3,
				padding: 100,
			},
		],
	};

	const options = {
		indexAxis: 'y' as const,
		responsive: true,
		aspectRatio: 6,
		plugins: {
			legend: {
				display: false,
			},
		},
		title: {
			display: false,
		},
	};

	if (completions.length < 5)
		return (
			<span>
				Scatter plot is not available for games with less than 5 completions.
			</span>
		);
	//@ts-ignore
	return <Chart type="boxplot" options={options} data={data} />;
	// return <Scatter options={options} data={data} />;
};
