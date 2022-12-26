import React from 'react';
import styled from 'styled-components';

import icons, { IconType as AssetIconType } from 'assets/icons';
import { ColorTokens } from 'styles';
import { Size, Tooltip } from 'components';

type Props = {
	className?: string;
	hoverText?: string;
	spin?: boolean;
	icon: AssetIconType;
	size?: Size | number;
	shadowColor?: ColorTokens | string;
} & Omit<React.CSSProperties, 'width' | 'height'>;

export const Icon = (props: Props): JSX.Element => {
	const {
		className,
		spin = false,
		hoverText,
		size = Size.MICRO,
		icon,
		shadowColor,
		...style
	} = props;
	const SVG = icons[icon];

	return (
		<Tooltip content={hoverText}>
			<StyledSVG
				className={className}
				style={style}
				size={size}
				spin={spin}
				shadowColor={shadowColor}>
				<SVG />
			</StyledSVG>
		</Tooltip>
	);
};

const StyledSVG = styled.span<{
	size: Size;
	spin: boolean;
	shadowColor?: ColorTokens | string;
}>`
	svg {
		${({ spin }) => spin && `animation: rotation 2s infinite linear;`}
		display: block;
		margin: 0 auto;
		min-height: ${({ size }) => size}px;
		max-height: ${({ size }) => size}px;
		height: ${({ size }) => size}px;
		width: ${({ size }) => size}px;
		${({ shadowColor }) =>
			shadowColor && `filter: drop-shadow(0 0 5px ${shadowColor});`}
		path {
			fill: currentColor;
		}
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
`;

export type IconType = AssetIconType;
