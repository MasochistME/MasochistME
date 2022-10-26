import styled from 'styled-components';

import { fonts } from 'styles/theme/themeOld';
import { Icon, IconType, Tooltip } from 'components';
import { Size } from 'components';
import { useTheme, ColorTokens } from 'styles';

type Props = {
	label?: string;
	icon?: IconType;
	iconPlacement?: 'left' | 'right';
	disabled?: boolean;
	tooltip?: React.ReactNode;
	size?: Size;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button = (props: Props) => {
	const {
		label,
		icon,
		iconPlacement = 'left',
		disabled = false,
		tooltip,
		size = Size.MEDIUM,
		onClick,
	} = props;
	const { colorTokens } = useTheme();
	return (
		<Tooltip content={tooltip}>
			<StyledButton
				iconOnly={!label}
				size={size}
				disabled={disabled}
				colorTokens={colorTokens}
				onClick={onClick}>
				{icon && iconPlacement === 'left' && <Icon icon={icon} />}
				{label && <span>{label}</span>}
				{icon && iconPlacement === 'right' && <Icon icon={icon} />}
			</StyledButton>
		</Tooltip>
	);
};

const StyledButton = styled.button<{
	size: Size;
	iconOnly: boolean;
	colorTokens: ColorTokens;
}>`
	margin: 0;
	padding: 0;
	border: none;
	gap: 8px;
	padding: 4px 12px;
	border-radius: 4px;
	border: ${({ iconOnly, colorTokens }) =>
		iconOnly ? 0 : `1px solid ${colorTokens['semantic-color-interactive']}`};
	font-size: ${({ size }) => {
		if (size === Size.TINY) return '8px';
		if (size === Size.SMALL) return '12px';
		if (size === Size.MEDIUM) return '18px';
		if (size === Size.BIG) return '24px';
		if (size === Size.LARGE) return '32px';
		return '18px';
	}};
	font-family: ${fonts.Raleway};
	background-color: ${({ iconOnly, colorTokens }) =>
		iconOnly ? 'transparent' : colorTokens['core-tertiary-bg']};
	color: ${({ colorTokens }) => colorTokens['core-secondary-text']};
	cursor: pointer;
	&:hover {
		color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	}
	& > *:not(:last-child) {
		margin-right: 8px;
	}
`;
