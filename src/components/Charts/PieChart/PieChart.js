import React from 'react';
import Chart from 'chart.js';

export default class PieChart extends React.Component {
	chartRef = React.createRef();
	
	componentDidMount = () => {
		const barChartRef = this.chartRef.current.getContext("2d");

		new Chart(barChartRef, {
			type: 'pie',
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
                title: {
                    display: true,
					text: this.props.title,
					fontColor: '#BEC9E0',
					fontFamily: "'Raleway', 'Verdana', sans-serif",
                    fontSize: '12',
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
					style={{ width: '400px', height: '300px' }}
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}