import React from 'react';
import { Flex, Size } from 'components';
import styled from 'styled-components';
import { fonts } from 'styles';

type Props = {
	width?: string;
	height?: string;
	maxWidth?: string;
	maxHeight?: string;
};
export const FetchError = (props: Props) => {
	return (
		<StyledWrapper {...props}>
			<StyledImg src="http://cdn.masochist.me/files/ash_fail.png" />
			<StyledText>Could not load</StyledText>
		</StyledWrapper>
	);
};

const StyledWrapper = styled(Flex)<Props>`
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: 16px;
	gap: 16px;
	${({ width }) => width && `width: ${width}`};
	${({ height }) => height && `height: ${height}`};
	${({ maxWidth }) => maxWidth && `maxWidth: ${maxWidth}`};
	${({ maxHeight }) => maxHeight && `maxHeight: ${maxHeight}`};
`;

const StyledImg = styled.img`
	width: ${Size.LARGE}px;
	filter: sepia(50%) opacity(50%);
`;

const StyledText = styled.div`
	font-family: ${fonts.Dosis};
	text-transform: uppercase;
	letter-spacing: 2px;
	opacity: 0.5;
`;
