import React from 'react';
import styled from 'styled-components';

import { LOGO } from 'shared/consts';
import { Theme } from 'styles/colors';
import { useAppContext } from 'context';

export const Logo = () => {
	const { activeTheme, setActiveTheme } = useAppContext();

	const onLogoClick = () => {
		if (activeTheme === Theme.ASH) setActiveTheme(Theme.MEAT);
		if (activeTheme === Theme.MEAT) setActiveTheme(Theme.ASH);
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
