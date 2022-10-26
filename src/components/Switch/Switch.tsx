import { Switch as MUISwitch, SwitchProps } from '@mui/material';
import styled from 'styled-components';

import { colors } from 'styles/theme/themeOld';

export const Switch = styled((props: SwitchProps) => (
	<MUISwitch
		focusVisibleClassName=".Mui-focusVisible"
		disableRipple
		{...props}
	/>
))({
	'width': 42,
	'height': 26,
	'padding': 0,
	'& .MuiSwitch-switchBase': {
		'padding': 0,
		'margin': 2,
		'transitionDuration': '300ms',
		'&.Mui-checked': {
			'transform': 'translateX(16px)',
			'color': '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: colors.superLightGrey,
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#33cf4d',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color: colors.mediumGrey,
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: 0.7,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
		color: colors.superDarkGrey,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: colors.newMediumGrey,
		opacity: 1,
	},
});
