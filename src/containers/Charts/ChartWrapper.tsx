import React from 'react';
import { Section } from 'components';

type TChartWrapper = {
	children: React.ReactNode;
	title: any;
	width?: string;
	height?: string;
};
export const ChartWrapper = (props: TChartWrapper): JSX.Element => {
	const { children, title, width, height } = props;

	const customStyle: any = {};

	const applyCustomStyle = () => {
		if (width) {
			customStyle.width = width;
		}
		if (height) {
			customStyle.height = height;
		}
		return customStyle;
	};

	return (
		<Section style={applyCustomStyle()}>
			<h3>
				{typeof title === 'object'
					? title.map((t: any) => <p key={t}>{t}</p>)
					: title}
			</h3>
			{children}
		</Section>
	);
};
