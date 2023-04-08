import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';
import { Icon, IconType, Tooltip } from 'components';
import { Size } from 'components';

type Props = {
	label?: string;
	icon?: IconType;
	iconPlacement?: 'left' | 'right';
	disabled?: boolean;
	toggled?: boolean;
	tooltip?: React.ReactNode;
	size?: Size;
	isGolden?: boolean;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button = (props: Props) => {
	const {
		label,
		icon,
		iconPlacement = 'left',
		disabled = false,
		toggled = false,
		tooltip,
		isGolden = false,
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
				toggled={toggled}
				colorTokens={colorTokens}
				isGolden={isGolden}
				onClick={onClick}>
				{icon && iconPlacement === 'left' && (
					<Icon icon={icon} size={size / 3} />
				)}
				{label && <span>{label}</span>}
				{icon && iconPlacement === 'right' && (
					<Icon icon={icon} size={size / 3} />
				)}
			</StyledButton>
		</Tooltip>
	);
};

const StyledButton = styled.button<{
	size: Size;
	toggled: boolean;
	iconOnly: boolean;
	isGolden: boolean;
	colorTokens: ColorTokens;
}>`
	display: flex;
	align-items: center;
	margin: 0;
	padding: 0;
	border: none;
	gap: var(--size-4);
	padding: ${({ iconOnly }) =>
		iconOnly ? `var(--size-8)` : 'var(--size-4) var(--size-12)'};
	border-radius: var(--size-4);
	border: ${({ iconOnly, isGolden, colorTokens }) => {
		if (iconOnly) return 0;
		if (isGolden)
			return `var(--size-1) solid ${colorTokens['semantic-color--tier-4']}`;
		return `var(--size-1) solid ${colorTokens['element-color--button-border']}`;
	}};
	font-size: ${({ size }) => {
		if (size === Size.TINY) return 'var(--size-8)';
		if (size === Size.SMALL) return 'var(--size-12)';
		if (size === Size.MEDIUM) return 'var(--size-18)';
		if (size === Size.BIG) return 'var(--size-24)';
		if (size === Size.LARGE) return 'var(--size-32)';
		return 'var(--size-18)';
	}};
	font-family: var(--font-raleway);
	background-color: ${({ iconOnly, isGolden, colorTokens }) => {
		if (iconOnly) return 'transparent';
		if (isGolden) return `${colorTokens['core-primary-bg']}99`;
		return colorTokens['element-color--button-bg'];
	}};
	color: ${({ colorTokens, isGolden, toggled }) => {
		if (isGolden) return colorTokens['semantic-color--tier-4'];
		if (toggled) return colorTokens['core-primary-text'];
		return colorTokens['element-color--button-text'];
	}};

	cursor: pointer;
	&:hover {
		color: ${({ colorTokens, isGolden }) =>
			isGolden
				? colorTokens['core-tertiary-text']
				: colorTokens['core-primary-text']};
	}
`;
