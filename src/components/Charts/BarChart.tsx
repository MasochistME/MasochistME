import React, { useEffect } from 'react';
import Chart from 'chart.js';

type Props = {
	labels: any;
	datasets: any;
};

export default function BarChart(props: Props): JSX.Element {
	const { labels, datasets } = props;
	const chartRef: React.RefObject<any> = React.createRef();

	useEffect(() => {
		const barChartRef = chartRef.current.getContext('2d');
		const colors = [
			'rgba(190, 201, 224, 1)',
			'rgba(158, 157, 181, 1)',
			'rgba(123, 122, 141, 1)',
			'rgba(36, 38, 48, 1)',
			'#rgba(20, 22, 32, 1)',
		];
		const axisOptions = [
			{
				gridLines: {
					color: '#242630',
				},
				ticks: {
					beginAtZero: true,
					barThickness: 10,
					fontColor: '#BEC9E0',
					fontFamily: '"Dosis", "Verdana", sans-serif',
					fontSize: 16,
				},
			},
		];

		new Chart(barChartRef, {
			type: 'bar',
			data: {
				labels,
				datasets: datasets.map((dataset: any, index: number) => {
					return {
						backgroundColor: colors[index],
						...dataset,
					};
				}),
			},
			options: {
				// @ts-ignore
				defaultFontColor: '#BEC9E0', // TODO
				defaultFontFamily: '"Raleway", "Verdana", sans-serif',
				defaultFontSize: '14',
				defaultFontStyle: 'normal',
				legend: {
					labels: {
						fontColor: 'white',
						fontFamily: 'Georgia',
						// textTransform: 'uppercase', // TODO
					},
				},
				scales: {
					xAxes: axisOptions,
					yAxes: axisOptions,
				},
			},
		});
	}, []);

	return (
		<canvas
			style={{ width: '100%', height: '200px' }}
			id="myChart"
			ref={chartRef}
		/>
	);
}
