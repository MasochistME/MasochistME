import React from 'react';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';

type WrapperProps = {
	type: string;
	children?: React.ReactNode;
	style?: any;
};

export const Wrapper = (props: WrapperProps): JSX.Element => {
	const { type, children, style } = props;
	if (type === 'middle') {
		return <WrapperMiddle style={style}>{children}</WrapperMiddle>;
	}
	if (type === 'main') {
		return <WrapperMain style={style}>{children}</WrapperMain>;
	}
	if (type === 'description') {
		return <WrapperDescription style={style}>{children}</WrapperDescription>;
	}
	if (type === 'page') {
		return <WrapperPage style={style}>{children}</WrapperPage>;
	}
	return <div className={`wrapper-${type}`}>{children}</div>;
};

const WrapperMain = styled.div.attrs(({ style }: { style?: any }) => {
	if (style) {
		return { style };
	}
})<{ style?: any }>`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;

	background-attachment: fixed;
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
	width: 100%;
	height: auto;
	min-height: 100vh;
	font-family: ${fonts.Raleway};
	text-align: justify;
`;

const WrapperPage = styled.div.attrs(({ style }: { style?: any }) => {
	if (style) {
		return { style };
	}
})<{ style?: any }>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	margin: 0;
	padding: 10px;
	width: 100%;
	box-sizing: border-box;
	background-color: ${colors.darkBlueTransparent};
`;

const WrapperMiddle = styled.div.attrs(({ style }: { style?: any }) => {
	if (style) {
		return { style };
	}
})<{ style?: any }>`
	display: flex;
	flex-direction: row;
	width: 100%;
	max-width: 1500px;
	height: auto;
`;

const WrapperDescription = styled.div.attrs(({ style }: { style?: any }) => {
	if (style) {
		return { style };
	}
})<{ style?: any }>`
	padding: 10px;
	box-sizing: border-box;
	background-color: ${colors.darkBlueTransparent};
	width: 100%;

	p {
		margin: 0 0 10px 0;
	}

	.fancy {
		margin-bottom: 10px;
		padding: 0;
		box-sizing: border-box;
		color: ${colors.superDarkGrey};
		box-shadow: 0 0 20px ${colors.superDarkGrey};
		background-color: ${colors.superLightGrey}aa;
		h3 {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 30px;
			padding: 0;
			margin: 0 0 10px 0;
			font-size: 1.3em;
			font-family: ${fonts.Dosis};
			text-transform: uppercase;
			background-color: ${colors.newDark}dd;
			color: ${colors.superLightGrey};
		}
	}
`;
