import React from 'react';
import styled from 'styled-components';

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
	align-content: flex-start;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 16px 8px;
	margin-bottom: 16px;
	gap: 16px;
`;
