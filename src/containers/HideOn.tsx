import React from 'react';
import styled from 'styled-components';

import { media as mapMedia } from 'shared/theme';

type Props = {
	media: keyof typeof mapMedia;
	children: React.ReactNode;
};

export const HideOn = (props: Props) => {
	const { children, media } = props;
	const hideBelow = mapMedia[media];
	return <StyledHide hideBelow={hideBelow}>{children}</StyledHide>;
};

const StyledHide = styled.div<{ hideBelow: string }>`
	@media (max-width: ${({ hideBelow }) => hideBelow}) {
		display: none;
	}
`;
