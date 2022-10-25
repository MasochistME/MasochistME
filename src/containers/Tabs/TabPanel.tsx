import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { ColorTokens } from 'styles/colors';
import { useAppContext } from 'context';

type Props = {
	activeTab: string;
	tabId: string;
	children?: React.ReactNode;
};

export const TabPanel = (props: Props) => {
	const { colorTokens } = useAppContext();
	const { children, activeTab, tabId, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={activeTab !== tabId}
			id={`simple-tabpanel-${tabId}`}
			aria-labelledby={`simple-tab-${tabId}`}
			{...other}>
			{activeTab === tabId && (
				<StyledTab colorTokens={colorTokens}>{children}</StyledTab>
			)}
		</div>
	);
};

const StyledTab = styled(Flex)<{ colorTokens: ColorTokens }>`
	width: 100%;
	padding: 16px;
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
	box-sizing: border-box;
`;
