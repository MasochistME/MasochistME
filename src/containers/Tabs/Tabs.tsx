import { Tab as MUITab, Tabs as MUITabs } from '@mui/material';
import { colors, fonts } from 'styles/theme/themeOld';
import styled from 'styled-components';

type StyledTabProps = {
	label: string;
	value: string;
};

export const Tab = styled((props: StyledTabProps) => (
	<MUITab disableRipple {...props} />
))({
	'textTransform': 'uppercase',
	'fontWeight': 'bold',
	'fontFamily': fonts.Dosis,
	'fontSize': 18,
	'color': colors.superLightGrey,
	'backgroundColor': `${colors.newDark}99`,
	'&.Mui-selected': {
		color: colors.lightestGreyEver,
	},
	'&.Mui-focusVisible': {
		backgroundColor: 'rgba(100, 95, 228, 0.32)',
	},
});

type StyledTabsProps = {
	children?: React.ReactNode;
	value: any;
	onChange: (event: React.SyntheticEvent, newValue: any) => void;
};

export const Tabs = styled((props: StyledTabsProps) => (
	<MUITabs
		{...props}
		TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
	/>
))({
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		height: '4px',
	},
	'& .MuiTabs-indicatorSpan': {
		maxWidth: 100,
		width: '100%',
		backgroundColor: colors.newMediumGrey,
	},
});
