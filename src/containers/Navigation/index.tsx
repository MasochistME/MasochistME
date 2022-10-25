import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useAppContext } from 'context';
import { fonts, media } from 'shared/theme';
import { tabs, Tab } from 'shared/config/tabs';
import { ColorTokens } from 'styles/colors';

export const Navigation = (): JSX.Element => {
	const { colorTokens } = useAppContext();
	return (
		<StyledNavigation colorTokens={colorTokens}>
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

	const { activeTab, colorTokens } = useAppContext();
	const history = useHistory();

	const isActive = tab.id === activeTab;

	const onTabOpen = (): void => {
		if (tab.external) window.open(tab.link);
		else history.push(`/${tab.link}`);
	};

	return (
		<StyledTabItem
			onClick={onTabOpen}
			active={isActive}
			colorTokens={colorTokens}>
			<StyledTabIcon className={tab.icon} />
			<StyledTabLabel>{tab.text}</StyledTabLabel>
		</StyledTabItem>
	);
};

const StyledNavigation = styled.div<{ colorTokens: ColorTokens }>`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(5, 1fr);
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	box-shadow: 0 0 30px ${({ colorTokens }) => colorTokens['core-primary-bg']};
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: ${fonts.Raleway};
	font-size: 0.9em;
	text-transform: uppercase;
	letter-spacing: 2px;
	position: sticky;
	top: 0px;
	z-index: 1000;
	list-style-type: none;
`;

type NavItemProps = { active?: boolean; colorTokens: ColorTokens };

const StyledTabItem = styled.div.attrs((props: NavItemProps) => {
	const { active } = props;
	const style: React.CSSProperties = {};
	if (active) {
		style.backgroundColor = props.colorTokens['core-primary-bg'];
	}
	return { style };
})<NavItemProps>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8px;
	padding: 24px 0;
	border-right: 3px solid ${({ colorTokens }) => colorTokens['core-primary-bg']};
	height: 100%;
	box-sizing: border-box;

	&:hover {
		background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']};
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
