import React from 'react';
import styled from 'styled-components';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import logo from 'shared/images/logo.ico';
import { BadgeTooltip } from 'containers';
import { Size } from 'utils';
import { colors } from 'shared/theme';
import { Tooltip } from 'components';

type Props = {
	badge?: Badge;
	size?: Size;
	title?: React.ReactNode;
	onClick?: () => void;
};

export const BadgeThumbnail = (props: Props) => {
	const { badge, size = Size.MEDIUM, title, onClick } = props;
	return title ? (
		<Tooltip content={title}>
			<StyledBadgeThumbnail
				onClick={onClick}
				size={size}
				src={badge?.img ?? logo}
				alt="Badge"
			/>
		</Tooltip>
	) : (
		<BadgeTooltip badge={badge}>
			<StyledBadgeThumbnail
				onClick={onClick}
				size={size}
				src={badge?.img ?? logo}
				alt="Badge"
			/>
		</BadgeTooltip>
	);
};

const StyledBadgeThumbnail = styled.img.attrs(
	(props: Pick<Props, 'size' | 'onClick'>) => {
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
)<Pick<Props, 'size' | 'onClick'>>`
	box-sizing: border-box;
	padding: 2px;
	border-radius: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? 4 : 8}px;
	border: ${({ size }) => (size === Size.SMALL || size === Size.TINY ? 2 : 3)}px
		solid ${colors.superLightGrey};
	opacity: ${({ size }) =>
		size === Size.SMALL || size === Size.TINY ? '0.85' : '1'};
	&:hover {
		opacity: 1;
	}
`;
