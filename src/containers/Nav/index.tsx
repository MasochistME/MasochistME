import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { NavItem } from './NavItem';

export const Nav = (): JSX.Element => {
	const tabs = useSelector((state: any) => state.tabs);

	return (
		<Row>
			{tabs.list.map((item: any, index: number) =>
				item.visible ? <NavItem key={`nav-${index} `} item={item} /> : null,
			)}
		</Row>
	);
};

const Row = styled.ul`
	display: flex;
	flex-direction: row;
`;
