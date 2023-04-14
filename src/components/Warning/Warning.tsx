import React from 'react';
import styled from 'styled-components';

import { Flex } from '../Flex';

type Props = { description: string };

export const Warning = (props: Props): JSX.Element => {
	const { description } = props;

	return <StyledWarning>⚠️ {description}</StyledWarning>;
};

const StyledWarning = styled(Flex)`
	font-weight: bold;
	font-size: var(--font-size-18);
	margin: var(--size-16) 0;
	text-align: center;
`;
