import React from 'react';

type TChartWrapper = {
  children: React.ReactNode;
  title: any;
  width?: number;
};
export default function ChartWrapper(props: TChartWrapper): JSX.Element {
  const { children, title, width } = props;

  return (
    <div
      className="profile-section flex-column"
      style={width ? { width: `${width}%` } : {}}>
      <h3 className="profile-section-title">
        {typeof title === 'object'
          ? title.map((t: any) => <p key={t}>{t}</p>)
          : title}
      </h3>
      {children}
    </div>
  );
}
