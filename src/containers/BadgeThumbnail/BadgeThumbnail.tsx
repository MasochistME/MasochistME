import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { BadgeTooltip, CommonProps } from 'containers';
import { Size } from 'components';
import { ColorTokens, useTheme } from 'styles';
import { Tooltip } from 'components';

type Props = CommonProps & {
	badge?: Badge;
};

export const BadgeThumbnail = (props: Props) => {
	const { colorTokens, LOGO_URL } = useTheme();
	const {
		badge,
		isDisabled,
		size = Size.MEDIUM,
		title,
		isLoading,
		onClick,
	} = props;

	const isNegative = (badge?.points ?? 0) < 0;
	const badgeComponent = (
		<StyledBadgeThumbnail
			size={size}
			isDisabled={isDisabled}
			isNegative={isNegative}
			colorTokens={colorTokens}
			onClick={onClick}>
			<img src={badge?.img ?? LOGO_URL} alt="Badge" loading="lazy" />
		</StyledBadgeThumbnail>
	);

	if (title) return <Tooltip content={title}>{badgeComponent}</Tooltip>;
	return <BadgeTooltip badge={badge}>{badgeComponent}</BadgeTooltip>;
};

const StyledBadgeThumbnail = styled.div.attrs(
	(
		props: Pick<Props, 'size' | 'onClick' | 'isDisabled'> & {
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
	/* padding: 2px; */
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? 4 : 8}px;
	border: ${({ size, isDisabled, isNegative, colorTokens }) => {
		const borderSize = size === Size.SMALL || size === Size.TINY ? 2 : 3;
		const borderColor = isDisabled
			? `${colorTokens['core-primary-text']}66`
			: isNegative
			? colorTokens['common-color--red']
			: colorTokens['core-primary-text'];
		return `${borderSize}px solid ${borderColor}`;
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
