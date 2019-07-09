import React from 'react';
import Chart from 'chart.js';

export default class DoughnutChart extends React.Component {
	chartRef = React.createRef();
	
	componentDidMount = () => {
		const barChartRef = this.chartRef.current.getContext("2d");

		new Chart(barChartRef, {
			type: 'doughnut',
			data: {
                labels: this.props.labels,
                datasets: [
                    {
						data: this.props.dataset,
						backgroundColor: [
							'#BEC9E0',
							'#9e9db5',
							'#7b7a8d',
							'#242630',
							'#141620',
						],
						borderColor: 'rgb(190, 201, 224)'
                    }
                ]
            },
            options: {
                legend: {
					position: 'bottom',
					labels: {
						fontColor: 'white',
						fontFamily: 'Georgia',
						textTransform: 'uppercase',
						usePointStyle: true,
					}
				}
            }
		})
	}

	render() {
        return (
			<canvas
				style={{ width: '300px', height: '300px' }}
				id="myChart"
				ref={this.chartRef}
			/>
        )
    }
}