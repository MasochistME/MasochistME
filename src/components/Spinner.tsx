import React from 'react';
import styled from 'styled-components';

export const Spinner = (): JSX.Element => {
	return (
		<Wrapper>
			<i className="fas fa-circle-notch fa-spin" />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 20px !important;
	font-size: 32px;
`;
