import React from 'react';
import styled from 'styled-components';

import { Flex, Size } from 'components';

type Props = {
	width?: string;
	height?: string;
	maxWidth?: string;
	maxHeight?: string;
	error?: string;
};
export const ErrorFallback = (props: Props) => {
	const { error = 'Could not load', ...rest } = props;
	return (
		<StyledWrapper {...rest}>
			<StyledImg src="http://cdn.masochist.me/files/ash_fail.png" />
			<StyledText>{error}</StyledText>
		</StyledWrapper>
	);
};

const StyledWrapper = styled(Flex)<Props>`
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding: var(--size-16);
	gap: var(--size-16);
	${({ width }) => width && `width: ${width}`};
	${({ height }) => height && `height: ${height}`};
	${({ maxWidth }) => maxWidth && `maxWidth: ${maxWidth}`};
	${({ maxHeight }) => maxHeight && `maxHeight: ${maxHeight}`};
`;

const StyledImg = styled.img`
	width: ${Size.LARGE}rem;
	filter: opacity(100%) drop-shadow(1px 1px 0 #555) drop-shadow(-1px 1px 0 #555)
		drop-shadow(1px -1px 0 #555) drop-shadow(-1px -1px 0 #555);
`;

const StyledText = styled.div`
	font-family: var(--font-dosis);
	text-transform: uppercase;
	letter-spacing: var(--size-2);
	opacity: 0.5;
`;
