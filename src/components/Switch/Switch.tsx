import { Switch as MUISwitch, SwitchProps } from '@mui/material';
import styled from 'styled-components';

import { ColorTokens, useTheme } from 'styles';

type Props = SwitchProps & { colortokens: ColorTokens };

export const Switch = (props: SwitchProps) => {
	const { colorTokens } = useTheme();
	return (
		<StyledSwitch
			focusVisibleClassName=".Mui-focusVisible"
			disableRipple
			colortokens={colorTokens}
			{...props}
		/>
	);
};

const StyledSwitch = styled(MUISwitch)<Props>`
	width: 42px;
	height: 26px;
	padding: 0;
	.MuiSwitch-switchBase {
		padding: 0;
		margin: 2px;
		transition-duration: 300ms;
		&.Mui-checked {
			transform: translateX(18px);
			color: #fff;
			& + .MuiSwitch-track {
				background-color: ${({ colortokens }) =>
					colortokens['semantic-color--switch-track--checked']};
				opacity: 1;
				border: 0;
			}
			&.Mui-disabled + .MuiSwitch-track {
				opacity: 0.5;
			}
		}
		&.Mui-focusVisible .MuiSwitch-thumb {
			color: #33cf4d;
			border: 6px solid #fff;
		}
		&.Mui-disabled .MuiSwitch-thumb {
			color: ${({ colortokens }) =>
				colortokens['semantic-color--switch-thumb--disabled']};
		}
		&.Mui-disabled + .MuiSwitch-track {
			opacity: 0.7;
		}
	}
	.MuiSwitch-thumb {
		box-sizing: border-box;
		width: 22px;
		height: 22px;
		color: ${({ colortokens }) => colortokens['semantic-color--switch-thumb']};
	}
	.MuiSwitch-track {
		border-radius: ${26 / 2}px;
		background-color: ${({ colortokens }) =>
			colortokens['semantic-color--switch-track']};
		opacity: 1;
	}
`;
