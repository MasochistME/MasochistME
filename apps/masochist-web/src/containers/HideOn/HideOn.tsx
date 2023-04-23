import React from 'react';
import styled from 'styled-components';

import { media as mapMedia } from 'styles';

type Props = {
	media: keyof typeof mapMedia;
	children: React.ReactNode;
} & React.CSSProperties;

export const HideOn = (props: Props) => {
	const { children, media, ...style } = props;
	const hideBelow = mapMedia[media];
	return (
		<StyledHide hideBelow={hideBelow} style={style}>
			{children}
		</StyledHide>
	);
};

const StyledHide = styled.div<{ hideBelow: string }>`
	@media (max-width: ${({ hideBelow }) => hideBelow}) {
		display: none !important;
	}
`;
