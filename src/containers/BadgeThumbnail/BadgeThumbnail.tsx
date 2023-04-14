import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { BadgeTooltip, CommonProps } from 'containers';
import { QueryBoundary, Size, Skeleton } from 'components';
import { ColorTokens, useTheme } from 'styles';
import { Tooltip } from 'components';
import { getBadgeThumbnail } from 'utils';

type Props = CommonProps & {
	badge?: Badge;
};

export const BadgeThumbnail = (props: Props) => {
	const { colorTokens } = useTheme();
	const {
		badge,
		isDisabled,
		isLoading,
		size = Size.MEDIUM,
		title,
		onClick,
	} = props;

	if (isLoading || !badge) return <Skeleton size={size} />;
	const badgeUrl = getBadgeThumbnail(badge);

	const isNegative = (badge.points ?? 0) < 0;
	const badgeComponent = (
		<StyledBadgeThumbnail
			size={size}
			isDisabled={isDisabled}
			isNegative={isNegative}
			colorTokens={colorTokens}
			onClick={onClick}>
			<img src={badgeUrl} alt="Badge" loading="lazy" />
		</StyledBadgeThumbnail>
	);

	if (title) return <Tooltip content={title}>{badgeComponent}</Tooltip>;
	return (
		<QueryBoundary fallback={null}>
			<BadgeTooltip badge={badge}>{badgeComponent}</BadgeTooltip>
		</QueryBoundary>
	);
};

const StyledBadgeThumbnail = styled.div.attrs(
	(
		props: Pick<Props, 'size' | 'onClick' | 'isDisabled'> & {
			colorTokens: ColorTokens;
		},
	) => {
		const { size, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: `${size}rem`,
			minHeight: `${size}rem`,
			maxWidth: `${size}rem`,
			maxHeight: `${size}rem`,
			cursor: onClick ? 'pointer' : 'help',
		};
		return { style };
	},
)<
	Pick<Props, 'size' | 'onClick' | 'isDisabled'> & {
		isNegative: boolean;
		colorTokens: ColorTokens;
	}
>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	overflow: hidden;
	/* padding: var(--size-2); */
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY
			? `var(--border-radius-4)`
			: `var(--border-radius-8)`};
	border: ${({ size, isDisabled, isNegative, colorTokens }) => {
		const borderSize = size === Size.SMALL || size === Size.TINY ? 0.2 : 0.3;
		const borderColor = isDisabled
			? `${colorTokens['core-primary-text']}66`
			: isNegative
			? colorTokens['common-color--red']
			: colorTokens['core-primary-text'];
		return `${borderSize}rem solid ${borderColor}`;
	}};

	img {
		width: 100%;
		height: 100%;
		opacity: ${({ size, isDisabled }) => {
			if (isDisabled) return 0.4;
			return size === Size.SMALL || size === Size.TINY ? 0.85 : 1;
		}};
		filter: ${({ isDisabled }) =>
			isDisabled ? 'grayscale(1)' : 'grayscale(0)'};
		&:hover {
			opacity: ${({ isDisabled }) => (isDisabled ? 0.7 : 1)};
		}
	}
`;
