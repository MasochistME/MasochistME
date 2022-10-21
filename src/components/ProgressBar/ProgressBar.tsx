import React from 'react';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';

type Props = {
	percentage: number;
	invert?: boolean;
	style?: React.CSSProperties;
};

export const ProgressBar = (props: Props): JSX.Element => {
	const { percentage, invert, style } = props;
	return (
		<ProgressBar.Completion invert={invert} style={style}>
			<ProgressBar.Progress percentage={percentage} invert={invert} />
			<ProgressBar.Percentage>{Math.round(percentage)}%</ProgressBar.Percentage>
		</ProgressBar.Completion>
	);
};

ProgressBar.Completion = styled.div.attrs(
	(props: Omit<Props, 'percentage'>) => {
		const style: React.CSSProperties = {
			backgroundColor: `${colors.newDark}`,
			border: `1px solid ${colors.newDark}`,
			...props.style,
		};
		if (props.invert) {
			style.backgroundColor = `${colors.newMediumGrey}`;
			style.border = `1px solid ${colors.newMediumGrey}`;
		}
		return { style };
	},
)<Omit<Props, 'percentage'>>`
	position: relative;
	min-width: 150px;
	height: 15px;
	margin-right: 7px;
	padding: 0 !important;
	box-sizing: border-box;
	@media (max-width: ${media.smallTablets}) {
		border: none;
		min-width: 100px;
	}
`;

ProgressBar.Progress = styled.div.attrs((props: Omit<Props, 'style'>) => {
	const style: React.CSSProperties = {
		width: `${props.percentage}%`,
		backgroundColor: `${colors.newMediumGrey}`,
	};
	if (props.invert) {
		style.backgroundColor = `${colors.newDark}`;
	}
	return { style };
})<Omit<Props, 'style'>>`
	position: absolute;
	height: 100%;
	padding: 0 !important;

	@media (max-width: ${media.smallTablets}) {
		display: none;
	}
`;

ProgressBar.Percentage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 100%;
	height: 100%;
	font-size: 0.77em;
	font-family: ${fonts.Verdana};
	letter-spacing: 0.1em;
	color: ${colors.superLightGrey};
`;
