import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { LOGO } from 'shared/consts';

export const Logo = () => {
	const history = useHistory();

	const onLogoClick = () => {
		history.push('/');
	};

	return <StyledLogo onClick={onLogoClick} src={LOGO} alt="Logo" />;
};

const StyledLogo = styled.img`
	cursor: pointer;
	max-height: 90%;
	width: auto;
	opacity: 0.8;
	&:hover {
		opacity: 1;
	}
`;
