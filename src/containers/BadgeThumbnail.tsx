import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { BadgeTooltip } from 'containers';
import { Size } from 'utils';
import { colors } from 'shared/theme';

type Props = {
	badge: Badge;
	size?: Size;
	onClick?: () => void;
};

export const BadgeThumbnail = (props: Props) => {
	const { badge, size = Size.MEDIUM, onClick } = props;
	return (
		<BadgeTooltip badge={badge}>
			<StyledBadgeThumbnail
				onClick={onClick}
				size={size}
				src={badge.img}
				alt="Badge"
			/>
		</BadgeTooltip>
	);
};

const StyledBadgeThumbnail = styled.img.attrs((props: { size: Size }) => {
	const { size } = props;
	const style: React.CSSProperties = {
		minWidth: size,
		minHeight: size,
		maxWidth: size,
		maxHeight: size,
	};
	return { style };
})<{ size: Size }>`
	box-sizing: border-box;
	cursor: help;
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? 4 : 8}px;
	border: ${({ size }) => (size === Size.SMALL || size === Size.TINY ? 1 : 3)}px
		solid ${colors.superLightGrey};
	opacity: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? '0.7' : '1'};
	&:hover {
		opacity: 1;
	}
`;
