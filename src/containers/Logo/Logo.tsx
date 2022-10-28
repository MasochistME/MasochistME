import React from 'react';
import styled from 'styled-components';

import { useTheme } from 'styles/theme';

export const Logo = () => {
	const { changeTheme, LOGO_URL } = useTheme();

	const onLogoClick = () => {
		changeTheme();
	};

	return <StyledLogo src={LOGO_URL} alt="Logo" onClick={onLogoClick} />;
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
