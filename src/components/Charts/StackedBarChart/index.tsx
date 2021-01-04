import React, { useEffect } from 'react';
import Chart from 'chart.js';

type Props = {
  labels: any;
  datasets: any;
};

export default function StackedBarChart(props: Props): JSX.Element {
  const { labels, datasets } = props;
  const chartRef: React.RefObject<any> = React.createRef();

  useEffect(() => {
    const barChartRef = chartRef.current.getContext('2d');
    const colors = (type: string) => [
      `#141620${type === 'transparent' ? '66' : 'ff'}`,
      `#242630${type === 'transparent' ? '66' : 'ff'}`,
      `#7b7a8d${type === 'transparent' ? '66' : 'ff'}`,
      `#9e9db5${type === 'transparent' ? '66' : 'ff'}`,
      `#BEC9E0${type === 'transparent' ? '66' : 'ff'}`,
    ];
    const axisOptions: any = {
      gridLines: {
        color: '#242630',
      },
      ticks: {
        beginAtZero: true,
        barThickness: 5,
        fontColor: '#BEC9E0',
        fontFamily: '"Dosis", "Verdana", sans-serif',
        fontSize: '16',
      },
    };

    new Chart(barChartRef, {
      type: 'horizontalBar',
      data: {
        labels: labels,
        datasets: datasets.map((dataset: any, index: number) => {
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
  }, []);

  return (
    <canvas
      style={{ width: '100%', height: '150px' }}
      id="myChart"
      ref={chartRef}
    />
  );
}
