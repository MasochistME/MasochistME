// import React, { useEffect } from 'react';
// import Chart from 'chart.js';

// type Props = {
// 	labels: any;
// 	datasets: any;
// };

// export const BarChart = (props: Props): JSX.Element => {
// 	const { labels, datasets } = props;
// 	const chartRef: React.RefObject<any> = React.createRef();

// 	useEffect(() => {
// 		const barChartRef = chartRef.current.getContext('2d');
// 		const colors = [
// 			'rgba(190, 201, 224, 1)',
// 			'rgba(158, 157, 181, 1)',
// 			'rgba(123, 122, 141, 1)',
// 			'rgba(36, 38, 48, 1)',
// 			'#rgba(20, 22, 32, 1)',
// 		];
// 		const axisOptions = [
// 			{
// 				gridLines: {
// 					color: '#242630',
// 				},
// 				ticks: {
// 					beginAtZero: true,
// 					barThickness: 10,
// 					fontColor: '#BEC9E0',
// 					fontFamily: '"Dosis", "Verdana", sans-serif',
// 					fontSize: 16,
// 				},
// 			},
// 		];

// 		new Chart(barChartRef, {
// 			type: 'bar',
// 			data: {
// 				labels,
// 				datasets: datasets.map((dataset: any, index: number) => {
// 					return {
// 						backgroundColor: colors[index],
// 						...dataset,
// 					};
// 				}),
// 			},
// 			options: {
// 				// @ts-ignore
// 				defaultFontColor: '#BEC9E0', // TODO
// 				defaultFontFamily: '"Raleway", "Verdana", sans-serif',
// 				defaultFontSize: '14',
// 				defaultFontStyle: 'normal',
// 				legend: {
// 					labels: {
// 						fontColor: 'white',
// 						fontFamily: 'Georgia',
// 						// textTransform: 'uppercase', // TODO
// 					},
// 				},
// 				scales: {
// 					xAxes: axisOptions,
// 					yAxes: axisOptions,
// 				},
// 			},
// 		});
// 	}, []);

// 	return (
// 		<canvas
// 			style={{ width: '100%', height: '200px' }}
// 			id="myChart"
// 			ref={chartRef}
// 		/>
// 	);
// };

import { Chart } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	ChartData,
	ChartOptions,
	registerables,
	ScaleOptionsByType,
} from 'chart.js';
import { useTheme } from 'styles';

ChartJS.register(...registerables);

type Props = {
	datasetIdKey: string;
	data: ChartData;
	options?: ChartOptions;
	axisOptions?: ScaleOptionsByType<any>;
};

export const BarChart = (props: Props): JSX.Element => {
	const { colorTokens } = useTheme();
	const { datasetIdKey, data, options = {} } = props;

	const axisOptions = {
		...props.axisOptions,
		grid: {
			color: colorTokens['semantic-color--interactive'],
		},
	};

	const config: { options: ChartOptions } = {
		options: {
			scales: {
				xAxis: axisOptions,
				yAxis: axisOptions,
			},
			responsive: true,
			elements: {
				bar: {
					borderWidth: 3,
				},
			},
			...options,
		},
	};

	ChartJS.defaults.color = 'white';
	ChartJS.defaults.font.size = 14;
	ChartJS.defaults.font.family = '"Raleway", "Verdana", sans-serif';

	return (
		<Chart type="bar" datasetIdKey={datasetIdKey} data={data} {...config} />
	);
};
