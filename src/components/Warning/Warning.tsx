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
	font-size: 1.5em;
	margin: 16px 0;
	text-align: center;
`;
