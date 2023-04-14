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
	width: var(--size-42);
	height: var(--size-26);
	padding: 0;
	.MuiSwitch-switchBase {
		padding: 0;
		margin: var(--size-2);
		transition-duration: 300ms;
		&.Mui-checked {
			transform: translateX(var(--size-18));
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
			border: var(--size-6) solid #fff;
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
		width: var(--size-22);
		height: var(--size-22);
		color: ${({ colortokens }) => colortokens['semantic-color--switch-thumb']};
	}
	.MuiSwitch-track {
		border-radius: var(--border-radius-16);
		background-color: ${({ colortokens }) =>
			colortokens['semantic-color--switch-track']};
		opacity: 1;
	}
`;
