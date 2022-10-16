import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useAppContext } from 'shared/store/context';
import { colors, media } from 'shared/theme';
import { Tab } from 'shared/config/tabs';
import { Flex } from 'components';

type Props = {
	tab: Tab;
};

export const NavItem = (props: Props): JSX.Element => {
	const { tab } = props;

	const { activeTab } = useAppContext();
	const history = useHistory();

	const isActive = tab.id === activeTab;

	const onTabOpen = (): void => {
		if (tab.external) window.open(tab.link);
		else history.push(`/${tab.link}`);
	};

	return (
		<TabItem onClick={onTabOpen} active={isActive}>
			<Flex column align>
				<i className={tab.icon} />
				<p>{tab.text}</p>
			</Flex>
		</TabItem>
	);
};

const TabItem = styled.li.attrs(({ active }: { active?: boolean }) => {
	const style: React.CSSProperties = {};
	if (active) {
		style.backgroundColor = colors.newDark;
	}
	return { style };
})<{ active?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-right: 3px solid ${colors.newDark};
	height: 100%;
	width: 20%;
	box-sizing: border-box;
	&:hover {
		background-color: ${colors.newDark};
		cursor: pointer;
	}
	p {
		margin: 10px 0 0 0;
		@media (max-width: ${media.tablets}) {
			display: none;
		}
	}
	i {
		font-size: 1.4em;
	}
`;
