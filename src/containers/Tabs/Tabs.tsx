import { Tab as MUITab, Tabs as MUITabs } from '@mui/material';
import styled from 'styled-components';

import { fonts, ColorTokens, useTheme } from 'styles';

/**
 * A single tab.
 */

type StyledTabProps = {
	label: string;
	value: string;
};

export const Tab = (props: StyledTabProps) => {
	const { colorTokens } = useTheme();
	return <StyledMUITab disableRipple colortokens={colorTokens} {...props} />;
};

const StyledMUITab = styled(MUITab)<{ colortokens: ColorTokens }>`
	text-transform: uppercase;
	font-weight: bold;
	font-family: ${fonts.Dosis};
	font-size': 18px;
	color: ${({ colortokens }) => colortokens['core-primary-text']};
	background-color: ${({ colortokens }) => colortokens['core-primary-bg']}99;
	.Mui-selected {
		color: ${({ colortokens }) => colortokens['common-color--light']};
	}
	.Mui-focusVisible {
		background-color: ${({ colortokens }) => colortokens['common-color--shadow']};
	}
`;

/**
 * The row of tabs.
 */

type StyledTabsProps = {
	children?: React.ReactNode;
	value: any;
	onChange: (event: React.SyntheticEvent, newValue: any) => void;
};

export const Tabs = (props: StyledTabsProps) => {
	const { colorTokens } = useTheme();
	return (
		<StyledMUITabs
			colortokens={colorTokens}
			{...props}
			TabIndicatorProps={{
				children: <span className="MuiTabs-indicatorSpan" />,
			}}
		/>
	);
};

const StyledMUITabs = styled(MUITabs)<{ colortokens: ColorTokens }>`
	.MuiTabs-indicator {
		display: flex;
		justify-content: center;
		background-color: transparent;
		height: 4px;
	}
	.MuiTabs-indicatorSpan {
		max-width: 100;
		width: 100%;
		background-color: ${({ colortokens }) =>
			colortokens['semantic-color--interactive']};
	}
`;
