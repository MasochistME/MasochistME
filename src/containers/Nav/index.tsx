import React from 'react';
import styled from 'styled-components';

import { tabs, Tab } from 'shared/config/tabs';
import { NavItem } from './NavItem';

export const Nav = (): JSX.Element => {
	return (
		<NavBar>
			{tabs.map((tab: Tab, index: number) =>
				tab.visible ? <NavItem key={`nav-${index} `} tab={tab} /> : null,
			)}
		</NavBar>
	);
};

const NavBar = styled.ul`
	display: flex;
	flex-direction: row;
`;
