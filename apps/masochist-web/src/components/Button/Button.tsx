import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';
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
	display: inline-flex;
	flex-basis: auto;
	align-items: center;
	align-self: flex-start;
	margin: auto 0;
	border: none;
	gap: var(--size-8);
	padding: ${({ iconOnly }) =>
		iconOnly ? `var(--size-8)` : 'var(--size-6) var(--size-10)'};
	border-radius: var(--border-radius-4);
	border: ${({ iconOnly, variant, colorTokens }) => {
		if (iconOnly) return 0;
		if (variant === Variant.GOLDEN) {
			return `1px solid ${colorTokens['semantic-color--tier-4']}`;
		}
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
`;
