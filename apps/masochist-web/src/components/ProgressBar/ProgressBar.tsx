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
			border: `var(--size-1) solid ${props.colorTokens['semantic-color--progress--track']}`,
			...props.style,
		};
		if (props.invert) {
			style.backgroundColor = `${props.colorTokens['semantic-color--progress--thumb']}`;
			style.border = `var(--size-1) solid ${props.colorTokens['semantic-color--progress--thumb']}`;
		}
		return { style };
	},
)<Omit<Props, 'percentage'> & { colorTokens: ColorTokens }>`
	position: relative;
	min-width: 20rem;
	height: var(--size-20);
	margin-right: var(--size-7);
	padding: 0 !important;
	box-sizing: border-box;
	border-radius: var(--border-radius-8);
	@media (max-width: ${media.tablets}) {
		border: none;
		min-width: 10rem;
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
	border-radius: var(--border-radius-8);
`;

ProgressBar.Percentage = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 100%;
	height: 100%;
	line-height: var(--size-11);
	font-size: var(--font-size-11);
	font-family: var(--font-raleway);
	font-weight: bold;
	letter-spacing: var(--size-1);
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	border-radius: var(--border-radius-8);
`;
