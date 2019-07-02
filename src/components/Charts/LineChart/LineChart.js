import React from 'react';
import Chart from 'chart.js';

export default class LineChart extends React.Component {
	chartRef = React.createRef();
	
	componentDidMount = () => {
		const barChartRef = this.chartRef.current.getContext("2d");
		const colors = ['#BEC9E0',
			'#9e9db5',
			'#7b7a8d',
			'#242630',
			'#141620',
		]
		const datasets = this.props.datasets.map((dataset, index) => {
			return {
				label: dataset.label,
				data: dataset.data,
				borderColor: [
					colors[index]
				],
				// steppedLine: 'before'
			}
		})

		new Chart(barChartRef, {
			type: 'line',
			data: {
                labels: this.props.labels,
                datasets
            },
            options: {
                title: {
                    display: true,
					text: this.props.title,
					fontColor: '#BEC9E0',
					fontFamily: "'Raleway', 'Verdana', sans-serif",
                    fontSize: '14',
                    fontStyle: 'normal',
					position: 'top'
                },
                legend: {
					labels: {
						fontColor: 'white',
						fontFamily: 'Georgia',
						textTransform: 'uppercase'
					}
				}
            }
		})
	}

	render() {
        return (
            <div>
                <canvas
					style={{ width: '100%', height: '500px' }}
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}