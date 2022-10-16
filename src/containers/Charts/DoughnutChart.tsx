import React, { useEffect } from 'react';
import Chart from 'chart.js';

type TDoughnutChart = {
	labels: any;
	dataset: any;
};

export const DoughnutChart = (props: TDoughnutChart): JSX.Element => {
	const { labels, dataset } = props;
	const chartRef: React.RefObject<any> = React.createRef();

	useEffect(() => {
		const barChartRef = chartRef.current.getContext('2d');
		new Chart(barChartRef, {
			type: 'doughnut',
			data: {
				labels,
				datasets: [
					{
						data: dataset,
						backgroundColor: [
							'#BEC9E0',
							'#9e9db5',
							'#7b7a8d',
							'#242630',
							'#141620',
						],
						borderColor: 'rgb(190, 201, 224)',
					},
				],
			},
			options: {
				legend: {
					position: 'bottom',
					labels: {
						fontColor: 'white',
						fontFamily: 'Georgia',
						// textTransform: 'uppercase', // TODO
						usePointStyle: true,
					},
				},
			},
		});
	}, []);

	return (
		<canvas
			style={{ width: '300px', height: '300px' }}
			id="myChart"
			ref={chartRef}
		/>
	);
};
