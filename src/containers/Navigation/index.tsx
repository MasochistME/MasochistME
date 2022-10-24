import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useAppContext } from 'context';
import { colors, fonts, media } from 'shared/theme';
import { tabs, Tab } from 'shared/config/tabs';
import { Flex } from 'components';

export const Navigation = (): JSX.Element => {
	return (
		<StyledNavigation>
			{tabs.map(
				(tab: Tab, index: number) =>
					tab.visible && <NavigationItem key={`nav-${index} `} tab={tab} />,
			)}
		</StyledNavigation>
	);
};

type Props = {
	tab: Tab;
};

const NavigationItem = (props: Props): JSX.Element => {
	const { tab } = props;

	const { activeTab } = useAppContext();
	const history = useHistory();

	const isActive = tab.id === activeTab;

	const onTabOpen = (): void => {
		if (tab.external) window.open(tab.link);
		else history.push(`/${tab.link}`);
	};

	return (
		<StyledTabItem onClick={onTabOpen} active={isActive}>
			<StyledTabIcon className={tab.icon} />
			<StyledTabLabel>{tab.text}</StyledTabLabel>
		</StyledTabItem>
	);
};

const StyledNavigation = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(5, 1fr);
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
`;

type NavItemProps = { active?: boolean };

const StyledTabItem = styled.div.attrs((props: NavItemProps) => {
	const { active } = props;
	const style: React.CSSProperties = {};
	if (active) {
		style.backgroundColor = colors.newDark;
	}
	return { style };
})<NavItemProps>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8px;
	padding: 24px 0;
	border-right: 3px solid ${colors.newDark};
	height: 100%;
	box-sizing: border-box;

	&:hover {
		background-color: ${colors.newDark};
		cursor: pointer;
	}

	@media (max-width: ${media.tablets}) {
		padding: 12px 0;
	}
`;

const StyledTabIcon = styled.i`
	font-size: 1.4em;
`;

const StyledTabLabel = styled.div`
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;
