import React from 'react';
import { Section } from 'shared/components';

type TChartWrapper = {
  children: React.ReactNode;
  title: any;
  width?: number;
};
export default function ChartWrapper(props: TChartWrapper): JSX.Element {
  const { children, title, width } = props;

  return (
    <Section style={width ? { width: `${width}%` } : {}}>
      <h3>
        {typeof title === 'object'
          ? title.map((t: any) => <p key={t}>{t}</p>)
          : title}
      </h3>
      {children}
    </Section>
  );
}
