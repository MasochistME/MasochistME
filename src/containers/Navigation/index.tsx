import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { Icon } from 'components';
import { useAppContext } from 'context';
import { media, useTheme, ColorTokens } from 'styles';
import { tabs, Tab } from 'configuration/tabs';

export const Navigation = (): JSX.Element => {
	const { colorTokens } = useTheme();
	const nrOfTabs = tabs.filter(t => t.visible).length;
	return (
		<StyledNavigation colorTokens={colorTokens} nrOfTabs={nrOfTabs}>
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
	const { colorTokens } = useTheme();
	const navigate = useNavigate();

	const isActive = tab.id === activeTab;

	const onTabOpen = (): void => {
		if (tab.external) window.open(tab.link);
		else navigate(`/${tab.link}`);
	};

	return (
		<StyledTabItem
			onClick={onTabOpen}
			active={isActive}
			colorTokens={colorTokens}>
			<Icon icon={tab.icon} />
			<StyledTabLabel>{tab.text}</StyledTabLabel>
		</StyledTabItem>
	);
};

const StyledNavigation = styled.div<{
	colorTokens: ColorTokens;
	nrOfTabs: number;
}>`
	display: grid;
	width: 100%;
	grid-template-columns: repeat(${({ nrOfTabs }) => nrOfTabs}, 1fr);
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	box-shadow: 0 var(--size-10) var(--size-10) -1rem ${({ colorTokens }) => colorTokens['common-color--shadow']};
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	font-family: var(--font-raleway);
	font-size: var(--font-size-11);
	text-transform: uppercase;
	letter-spacing: 0.15rem;
	position: sticky;
	top: 0;
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
	gap: var(--size-8);
	padding: var(--size-16) 0;
	border-right: var(--size-3) solid
		${({ colorTokens }) => colorTokens['element-color--header-bg']};

	&:hover {
		background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']};
		cursor: pointer;
	}

	@media (max-width: ${media.tablets}) {
		padding: var(--size-12) 0;
	}
`;

const StyledTabLabel = styled.div`
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;
