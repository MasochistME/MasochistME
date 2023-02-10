import styled from 'styled-components';

import { fonts, useTheme, ColorTokens } from 'styles';
import { Icon, IconType, Tooltip } from 'components';
import { Size } from 'components';
import { Variant } from './types';
import React from 'react';

type Props = {
	label?: string;
	icon?: IconType;
	iconPlacement?: 'left' | 'right';
	disabled?: boolean;
	toggled?: boolean;
	tooltip?: React.ReactNode;
	size?: Size;
	variant?: Variant;
	className?: string;
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
		size = Size.MEDIUM,
		variant = Variant.DEFAULT,
		className,
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
				variant={variant}
				onClick={onClick}
				className={className}>
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

type StyledButtonProps = {
	size: Size;
	variant: Variant;
	toggled: boolean;
	iconOnly: boolean;
	colorTokens: ColorTokens;
};
const StyledButton = styled.button.attrs((props: Props) => {
	const style: React.CSSProperties = {
		cursor: props.disabled ? `not-allowed` : 'pointer',
	};
	return { style };
})<StyledButtonProps>`
	display: flex;
	align-items: center;
	margin: 0;
	padding: 0;
	gap: 4px;
	font-family: ${fonts.Raleway};
	border-radius: 4px;
	padding: ${({ iconOnly }) => (iconOnly ? `8px` : '4px 12px')};
	border: ${({ iconOnly, variant, disabled, colorTokens }) => {
		if (iconOnly) return 0;
		if (disabled)
			return `1px solid ${colorTokens['semantic-color--disabled']}55`;
		if (variant === Variant.GOLDEN) {
			return `1px solid ${colorTokens['semantic-color--tier-4']}`;
		}
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
	background-color: ${({ iconOnly, variant, colorTokens }) => {
		if (iconOnly) return 'transparent';
		if (variant === Variant.DEFAULT)
			return colorTokens['element-color--button-bg'];
		if (variant === Variant.PRIMARY)
			return colorTokens['element-color--button-text'];
		if (variant === Variant.GOLDEN)
			return `${colorTokens['core-primary-bg']}99`;
	}};
	color: ${({ colorTokens, variant, disabled, toggled }) => {
		if (disabled) return colorTokens['semantic-color--disabled'];
		if (toggled) return colorTokens['core-primary-text'];
		if (variant === Variant.DEFAULT)
			return colorTokens['element-color--button-text'];
		if (variant === Variant.PRIMARY)
			return colorTokens['element-color--button-bg'];
		if (variant === Variant.GOLDEN)
			return colorTokens['semantic-color--tier-4'];
	}};

	&:hover {
		color: ${({ colorTokens, disabled, variant }) => {
			if (disabled) return;
			if (variant === Variant.DEFAULT) return colorTokens['core-primary-text'];
			if (variant === Variant.PRIMARY)
				return colorTokens['element-color--button-bg'];
			if (variant === Variant.GOLDEN) return colorTokens['core-tertiary-text'];
		}};
	}
	& > *:not(:last-child) {
		margin-right: 8px;
	}
`;
