import React from 'react';
import styled from 'styled-components';

import icons, { IconType as AssetIconType } from 'assets/icons';
import { Size } from 'components';

type Props = {
	className?: string;
	icon: AssetIconType;
	size?: Size;
} & Omit<React.CSSProperties, 'width' | 'height'>;

export const Icon = (props: Props): JSX.Element => {
	const { className, size = Size.TINY, icon, ...style } = props;
	const SVG = icons[icon];

	return (
		<StyledSVG className={className} style={style} size={size}>
			<SVG />
		</StyledSVG>
	);
};

const StyledSVG = styled.span<{ size: Size }>`
	svg {
		display: block;
		margin: 0 auto;
		min-height: ${({ size }) => size}px;
		max-height: ${({ size }) => size}px;
		path {
			fill: currentColor;
		}
	}
`;

export type IconType = AssetIconType;
