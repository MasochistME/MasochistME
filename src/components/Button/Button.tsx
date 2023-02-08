import styled from 'styled-components';

import { fonts, useTheme, ColorTokens } from 'styles';
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
	gap: 4px;
	padding: ${({ iconOnly }) => (iconOnly ? `8px` : '4px 12px')};
	border-radius: 4px;
	border: ${({ iconOnly, isGolden, colorTokens }) => {
		if (iconOnly) return 0;
		if (isGolden) return `1px solid ${colorTokens['semantic-color--tier-4']}`;
		return `1px solid ${colorTokens['element-color--button-border']}`;
	}};
	font-size: ${({ size }) => {
		if (size === Size.TINY) return '8px';
		if (size === Size.SMALL) return '12px';
		if (size === Size.MEDIUM) return '18px';
		if (size === Size.BIG) return '24px';
		if (size === Size.LARGE) return '32px';
		return '18px';
	}};
	font-family: ${fonts.Raleway};
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
	& > *:not(:last-child) {
		margin-right: 8px;
	}
`;
