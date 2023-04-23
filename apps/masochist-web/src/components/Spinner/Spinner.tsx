import React from 'react';
import styled from 'styled-components';

import { Flex, Icon, Size } from 'components';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	size?: Size;
};
export const Spinner = (props: Props): JSX.Element => {
	const { size = Size.MEDIUM } = props;
	const { colorTokens } = useTheme();

	return (
		<StyledSpinner align justify colorTokens={colorTokens}>
			<Icon icon="Spin" size={size} spin />
		</StyledSpinner>
	);
};

const StyledSpinner = styled(Flex)<{ colorTokens: ColorTokens }>`
	box-sizing: border-box;
	font-size: var(--font-size-32);
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
`;
