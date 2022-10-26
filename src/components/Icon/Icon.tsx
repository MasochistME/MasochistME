import React from 'react';
import styled from 'styled-components';

import icons, { IconType } from 'assets/icons';
import { Size } from 'utils';

type Props = {
	className?: string;
	icon: IconType;
	size?: Size;
	style?: React.CSSProperties;
};

export const Icon = (props: Props): JSX.Element => {
	const { className, size = Size.TINY, icon, style = {} } = props;
	const SVG = icons[icon];

	return (
		<StyledSVG className={className} style={style} size={size}>
			<SVG />
		</StyledSVG>
	);
};

const StyledSVG = styled.span<{ size: Size }>`
	svg {
		min-width: ${({ size }) => size}px;
		max-width: ${({ size }) => size}px;
		min-height: ${({ size }) => size}px;
		max-height: ${({ size }) => size}px;
		path {
			fill: currentColor;
		}
	}
`;
