// import React, { useEffect } from 'react';
// import Chart from 'chart.js';

// type TLineChart = {
// 	datasets: any;
// 	labels: any;
// };

// export const LineChart = (props: TLineChart): JSX.Element => {
// 	const { datasets, labels } = props;
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
// 		const ds = datasets.map((dataset: any, index: number) => {
// 			return {
// 				label: dataset.label,
// 				data: dataset.data,
// 				borderColor: [colors[index]],
// 				pointBorderColor: colors[index],
// 				pointBackgroundColor: colors[index],
// 				lineTension: 0.2,
// 				// steppedLine: 'before'
// 			};
// 		});

// 		const axisOptions = [
// 			{
// 				gridLines: {
// 					color: '#242630',
// 				},
// 				ticks: {
// 					fontColor: '#BEC9E0',
// 					fontFamily: '"Dosis", "Verdana", sans-serif',
// 					fontSize: 16,
// 				},
// 			},
// 		];

// 		new Chart(barChartRef, {
// 			type: 'line',
// 			data: {
// 				labels,
// 				datasets: ds,
// 			},
// 			options: {
// 				// @ts-ignore
// 				defaultFontColor: '#BEC9E0',
// 				defaultFontFamily: '"Raleway", "Verdana", sans-serif',
// 				defaultFontSize: '14',
// 				defaultFontStyle: 'normal',
// 				legend: {
// 					labels: {
// 						fontColor: 'white',
// 						fontFamily: 'Georgia',
// 						// textTransform: 'uppercase',
// 					},
// 				},
// 				scales: {
// 					yAxes: axisOptions,
// 					xAxes: axisOptions,
// 				},
// 			},
// 		});
// 	}, []);

// 	return (
// 		<canvas
// 			style={{ width: '100%', height: '500px' }}
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

export const LineChart = (props: Props): JSX.Element => {
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
		<Chart type="line" datasetIdKey={datasetIdKey} data={data} {...config} />
	);
};
