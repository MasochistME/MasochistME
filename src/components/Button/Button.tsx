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
	border: none;
	gap: var(--size-8);
	padding: ${({ iconOnly }) =>
		iconOnly ? `var(--size-8)` : 'var(--size-6) var(--size-10)'};
	border-radius: var(--border-radius-4);
	border: ${({ iconOnly, isGolden, colorTokens }) => {
		if (iconOnly) return 0;
		if (isGolden)
			return `var(--size-1) solid ${colorTokens['semantic-color--tier-4']}`;
		return `var(--size-1) solid ${colorTokens['element-color--button-border']}`;
	}};
	font-size: ${({ size }) => {
		if (size === Size.TINY) return 'var(--font-size-12)';
		if (size === Size.SMALL) return 'var(--font-size-14)';
		if (size === Size.MEDIUM) return 'var(--font-size-16)';
		if (size === Size.BIG) return 'var(--font-size-18)';
		if (size === Size.LARGE) return 'var(--font-size-20)';
		return 'var(--font-size-16)';
	}};
	font-family: var(--font-raleway);
	font-weight: 600;
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
