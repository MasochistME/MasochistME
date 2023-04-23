import React from 'react';
import styled from 'styled-components';

import { Flex } from 'components';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	activeTab: string;
	tabId: string;
	children?: React.ReactNode;
};

export const TabPanel = (props: Props) => {
	const { colorTokens } = useTheme();
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
	padding: var(--size-16);
	background-color: ${({ colorTokens }) => colorTokens['core-primary-bg']}99;
	box-sizing: border-box;
`;
