// import React, { useEffect } from 'react';
// import Chart from 'chart.js';

// type TDoughnutChart = {
// 	labels: any;
// 	dataset: any;
// 	width?: number;
// };

// export const DoughnutChart = (props: TDoughnutChart): JSX.Element => {
// 	const { labels, dataset, width } = props;
// 	const chartRef: React.RefObject<any> = React.createRef();

// 	const sideWidth = `${width ?? 300}px`;

// 	useEffect(() => {
// 		const barChartRef = chartRef.current.getContext('2d');
// 		new Chart(barChartRef, {
// 			type: 'doughnut',
// 			data: {
// 				labels,
// 				datasets: [
// 					{
// 						data: dataset,
// 						backgroundColor: [
// 							'#BEC9E0',
// 							'#9e9db5',
// 							'#7b7a8d',
// 							'#242630',
// 							'#141620',
// 						],
// 						borderColor: 'rgb(190, 201, 224)',
// 					},
// 				],
// 			},
// 			options: {
// 				legend: {
// 					position: 'bottom',
// 					labels: {
// 						fontColor: 'white',
// 						fontFamily: 'Georgia',
// 						// textTransform: 'uppercase', // TODO
// 						usePointStyle: true,
// 					},
// 				},
// 			},
// 		});
// 	}, []);

// 	return (
// 		<canvas
// 			style={{ width: sideWidth, height: sideWidth }}
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

ChartJS.register(...registerables);

type Props = {
	datasetIdKey: string;
	data: ChartData;
	options?: ChartOptions;
	axisOptions?: ScaleOptionsByType<any>;
};

export const DoughnutChart = (props: Props): JSX.Element => {
	const { datasetIdKey, data, options = {} } = props;
	const { labels, datasets } = data;

	const fixedDatasets = datasets.map(dataset => ({
		backgroundColor: ['#BEC9E0', '#9e9db5', '#7b7a8d', '#242630', '#141620'],
		borderColor: 'rgb(190, 201, 224)',
		...dataset,
	}));

	const config: { options: ChartOptions } = {
		options: {
			responsive: true,
			...options,
		},
	};

	ChartJS.defaults.color = 'white';
	ChartJS.defaults.font.size = 14;
	ChartJS.defaults.font.family = '"Raleway", "Verdana", sans-serif';

	return (
		<Chart
			type="doughnut"
			datasetIdKey={datasetIdKey}
			data={{ labels, datasets: fixedDatasets }}
			{...config}
		/>
	);
};
