import React from 'react';
import styled from 'styled-components';

import { colors } from 'shared/theme';
import { Flex } from 'components';

type Props = {
	activeTab: string;
	tabId: string;
	children?: React.ReactNode;
};

export const TabPanel = (props: Props) => {
	const { children, activeTab, tabId, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={activeTab !== tabId}
			id={`simple-tabpanel-${tabId}`}
			aria-labelledby={`simple-tab-${tabId}`}
			{...other}>
			{activeTab === tabId && <StyledTab>{children}</StyledTab>}
		</div>
	);
};

const StyledTab = styled(Flex)`
	width: 100%;
	padding: 16px 8px;
	background-color: ${colors.newDark}99;
	box-sizing: border-box;
`;
