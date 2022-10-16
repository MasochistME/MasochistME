import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { colors, media } from 'shared/theme';
import { Flex } from 'components';

type Props = {
	item: any;
};

export const NavItem = (props: Props): JSX.Element => {
	const { item } = props;
	const history = useHistory();
	const activeTab = useSelector((state: any) => state.tabs.active);
	const isActive = item.link === activeTab;

	const onTabOpen = (): void => {
		if (item.external) {
			window.open(item.link);
			return;
		}
		history.push(`/${item.link}`);
	};

	return (
		<Tab onClick={onTabOpen} active={isActive}>
			<Flex column align>
				<i className={item.icon} />
				<p>{item.text}</p>
			</Flex>
		</Tab>
	);
};

const Tab = styled.li.attrs(({ active }: { active?: boolean }) => {
	const style: any = {};
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
