import React from 'react';
import Chart from 'chart.js';

export default class BarChart extends React.Component {
  chartRef = React.createRef();

  componentDidMount = () => {
    const { labels, datasets } = this.props;
    const barChartRef = this.chartRef.current.getContext('2d');
    const colors = type => [
      `#141620${type === 'transparent' ? '66' : 'ff'}`,
      `#242630${type === 'transparent' ? '66' : 'ff'}`,
      `#7b7a8d${type === 'transparent' ? '66' : 'ff'}`,
      `#9e9db5${type === 'transparent' ? '66' : 'ff'}`,
      `#BEC9E0${type === 'transparent' ? '66' : 'ff'}`,
    ];
    const axisOptions = {
      gridLines: {
        color: '#242630',
      },
      ticks: {
        beginAtZero: true,
        barThickness: 5,
        fontColor: '#BEC9E0',
        fontFamily: "'Dosis', 'Verdana', sans-serif",
        fontSize: '16',
      },
    };

    new Chart(barChartRef, {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: datasets.map((dataset, index) => {
          return {
            backgroundColor: dataset.colorTransparent
              ? dataset.colorTransparent
              : colors('transparent')[index],
            borderColor: dataset.colorNormal
              ? dataset.colorNormal
              : colors('full')[index],
            borderSkipped: false,
            borderWidth: 1,
            label: dataset.label,
            data: dataset.data,
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
          xAxes: [
            {
              ...axisOptions,
              stacked: false,
            },
          ],
          yAxes: [
            {
              ...axisOptions,
              stacked: true,
            },
          ],
        },
      },
    });
  };

  render() {
    return (
      <canvas
        style={{ width: '100%', height: '150px' }}
        id="myChart"
        ref={this.chartRef}
      />
    );
  }
}
