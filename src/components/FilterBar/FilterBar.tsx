import React from 'react';
import styled from 'styled-components';

import { media } from 'shared/theme';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	children: React.ReactNode;
};
export const FilterBar = (props: Props): JSX.Element => {
	const { colorTokens } = useTheme();
	const { children } = props;

	return (
		<StyledFilterBar colorTokens={colorTokens}>{children}</StyledFilterBar>
	);
};

const StyledFilterBar = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 16px 8px;
	margin-bottom: 16px;
	gap: 16px;
	@media (max-width: ${media.smallNetbooks}) {
		background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
		align-items: center;
		justify-content: center;
	}
`;
