import React from 'react';
import Chart from 'chart.js';

export default class BarChart extends React.Component {
  chartRef = React.createRef();

  componentDidMount = () => {
    const barChartRef = this.chartRef.current.getContext('2d');
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
          fontFamily: "'Dosis', 'Verdana', sans-serif",
          fontSize: '16',
        },
      },
    ];

    new Chart(barChartRef, {
      type: 'bar',
      data: {
        labels: this.props.labels,
        datasets: this.props.datasets.map((dataset, index) => {
          return {
            backgroundColor: colors[index],
            ...dataset,
          };
        }),
      },
      options: {
        defaultFontColor: '#BEC9E0',
        defaultFontFamily: "'Raleway', 'Verdana', sans-serif",
        defaultFontSize: '14',
        defaultFontStyle: 'normal',
        legend: {
          labels: {
            fontColor: 'white',
            fontFamily: 'Georgia',
            textTransform: 'uppercase',
          },
        },
        scales: {
          xAxes: axisOptions,
          yAxes: axisOptions,
        },
      },
    });
  };

  render() {
    return (
      <canvas
        style={{ width: '100%', height: '200px' }}
        id="myChart"
        ref={this.chartRef}
      />
    );
  }
}
