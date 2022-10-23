import React from 'react';
import styled from 'styled-components';

import { colors, media } from 'shared/theme';

type Props = {
	children: React.ReactNode;
};
export const FilterBar = (props: Props): JSX.Element => {
	const { children } = props;
	return <StyledFilterGameBar>{children}</StyledFilterGameBar>;
};

const StyledFilterGameBar = styled.div`
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
		background-color: ${colors.superDarkGrey}aa;
		align-items: center;
		justify-content: center;
	}
`;
