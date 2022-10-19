import React from 'react';
import styled from 'styled-components';
import { colors, fonts, media } from 'shared/theme';

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

const NavBar = styled.ul.attrs(
	({ style = {} }: { style?: React.CSSProperties }) => {
		return { style };
	},
)<{ style?: React.CSSProperties }>`
	display: flex;
	flex-direction: row;
	width: 100%;
	margin: 0;
	padding: 0;
	background-color: ${colors.superDarkGrey};
	box-shadow: 0 0 30px ${colors.newDark};
	color: ${colors.superLightGrey};
	font-family: ${fonts.Raleway};
	font-size: 0.9em;
	text-transform: uppercase;
	letter-spacing: 2px;
	position: sticky;
	top: 0px;
	z-index: 1000;
	list-style-type: none;
	@media (max-width: ${media.tablets}) {
		height: 50px;
	}
`;
