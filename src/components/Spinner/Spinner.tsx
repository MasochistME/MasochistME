import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { ColorTokens } from 'styles/colors';
import { useAppContext } from 'context';

export const Spinner = (): JSX.Element => {
	const { colorTokens } = useAppContext();

	return (
		<StyledSpinner align justify colorTokens={colorTokens}>
			<i className="fas fa-circle-notch fa-spin" />
		</StyledSpinner>
	);
};

const StyledSpinner = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	font-size: 32px;
	color: ${({ colorTokens }) => colorTokens['semantic-color-interactive']};
`;
