import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { BadgeTooltip, CommonProps } from 'containers';
import { Size } from 'components';
import { ColorTokens, useTheme } from 'styles';
import { Skeleton, Tooltip } from 'components';

type Props = CommonProps & {
	badge?: Badge;
};

export const BadgeThumbnail = (props: Props) => {
	const { colorTokens, LOGO_URL } = useTheme();
	const {
		badge,
		disabled,
		size = Size.MEDIUM,
		title,
		isLoading,
		onClick,
	} = props;

	const badgeComponent = (
		<StyledBadgeThumbnail
			size={size}
			disabled={disabled}
			colorTokens={colorTokens}
			onClick={onClick}>
			<img src={badge?.img ?? LOGO_URL} alt="Badge" loading="lazy" />
		</StyledBadgeThumbnail>
	);
	return title ? (
		<Tooltip content={title}>{badgeComponent}</Tooltip>
	) : (
		<BadgeTooltip badge={badge}>{badgeComponent}</BadgeTooltip>
	);
};

const StyledBadgeThumbnail = styled.div.attrs(
	(
		props: Pick<Props, 'size' | 'onClick' | 'disabled'> & {
			colorTokens: ColorTokens;
		},
	) => {
		const { size, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: size,
			minHeight: size,
			maxWidth: size,
			maxHeight: size,
			cursor: onClick ? 'pointer' : 'help',
		};
		return { style };
	},
)<Pick<Props, 'size' | 'onClick' | 'disabled'> & { colorTokens: ColorTokens }>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	overflow: hidden;
	/* padding: 2px; */
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? 4 : 8}px;
	border: ${({ size, disabled, colorTokens }) => {
		const borderSize = size === Size.SMALL || size === Size.TINY ? 2 : 3;
		const borderColor = disabled
			? `${colorTokens['core-primary-text']}66`
			: colorTokens['core-primary-text'];
		return `${borderSize}px solid ${borderColor}`;
	}};

	img {
		width: 100%;
		height: 100%;
		opacity: ${({ size, disabled }) => {
			if (disabled) return 0.4;
			return size === Size.SMALL || size === Size.TINY ? 0.85 : 1;
		}};
		filter: ${({ disabled }) => (disabled ? 'grayscale(1)' : 'grayscale(0)')};
		&:hover {
			opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
		}
	}
`;
