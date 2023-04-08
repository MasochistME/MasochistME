import React from 'react';
import styled from 'styled-components';

import { media, useTheme, ColorTokens } from 'styles';

type Props = {
	percentage: number;
	invert?: boolean;
	style?: React.CSSProperties;
};

export const ProgressBar = (props: Props): JSX.Element => {
	const { colorTokens } = useTheme();
	const { percentage, invert, style } = props;

	return (
		<ProgressBar.Completion
			invert={invert}
			colorTokens={colorTokens}
			style={style}>
			<ProgressBar.Progress
				percentage={percentage}
				invert={invert}
				colorTokens={colorTokens}
			/>
			<ProgressBar.Percentage colorTokens={colorTokens}>
				{Math.round(percentage)}%
			</ProgressBar.Percentage>
		</ProgressBar.Completion>
	);
};

ProgressBar.Completion = styled.div.attrs(
	(props: Omit<Props, 'percentage'> & { colorTokens: ColorTokens }) => {
		const style: React.CSSProperties = {
			backgroundColor: props.colorTokens['semantic-color--progress--track'],
			border: `1px solid ${props.colorTokens['semantic-color--progress--track']}`,
			...props.style,
		};
		if (props.invert) {
			style.backgroundColor = `${props.colorTokens['semantic-color--progress--thumb']}`;
			style.border = `1px solid ${props.colorTokens['semantic-color--progress--thumb']}`;
		}
		return { style };
	},
)<Omit<Props, 'percentage'> & { colorTokens: ColorTokens }>`
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

ProgressBar.Progress = styled.div.attrs(
	(props: Omit<Props, 'style'> & { colorTokens: ColorTokens }) => {
		const isDone = props.percentage === 100;
		const style: React.CSSProperties = {
			width: `${props.percentage}%`,
			backgroundColor: isDone
				? props.colorTokens['semantic-color--progress--thumb']
				: `${props.colorTokens['semantic-color--progress--thumb']}aa`,
		};
		if (props.invert) {
			style.backgroundColor =
				props.colorTokens['semantic-color--progress--track'];
		}
		return { style };
	},
)<Omit<Props, 'style'> & { colorTokens: ColorTokens }>`
	position: absolute;
	height: 100%;
	padding: 0 !important;
	border-radius: 8px;
`;

ProgressBar.Percentage = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 100%;
	height: 100%;
	font-size: 0.9em;
	font-family: var(--font-raleway);
	font-weight: bold;
	letter-spacing: 0.1em;
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border-radius: 8px;
`;
