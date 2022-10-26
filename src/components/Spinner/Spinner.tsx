import React from 'react';
import styled from 'styled-components';

import { Flex, Icon, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';

export const Spinner = (): JSX.Element => {
	const { colorTokens } = useTheme();

	return (
		<StyledSpinner align justify colorTokens={colorTokens}>
			<Icon icon="Spin" size={Size.BIG} spin />
		</StyledSpinner>
	);
};

const StyledSpinner = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	font-size: 32px;
	color: ${({ colorTokens }) => colorTokens['semantic-color-interactive']};
`;
