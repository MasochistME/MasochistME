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
	min-width: 200px;
	height: 20px;
	margin-right: 7px;
	padding: 0 !important;
	box-sizing: border-box;
	border-radius: 8px;
	@media (max-width: ${media.tablets}) {
		border: none;
		min-width: 100px;
	}
`;

ProgressBar.Progress = styled.div.attrs((props: Omit<Props, 'style'>) => {
	const isDone = props.percentage === 100;
	const style: React.CSSProperties = {
		width: `${props.percentage}%`,
		backgroundColor: isDone
			? colors.newMediumGrey
			: `${colors.newMediumGrey}aa`,
	};
	if (props.invert) {
		style.backgroundColor = `${colors.newDark}`;
	}
	return { style };
})<Omit<Props, 'style'>>`
	position: absolute;
	height: 100%;
	padding: 0 !important;
	border-radius: 8px;
`;

ProgressBar.Percentage = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 100%;
	height: 100%;
	font-size: 0.9em;
	font-family: ${fonts.Raleway};
	font-weight: bold;
	letter-spacing: 0.1em;
	color: ${colors.superLightGrey};
	border-radius: 8px;
`;
