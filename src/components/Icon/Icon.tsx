import React from 'react';
import styled from 'styled-components';

import icons, { IconType as AssetIconType } from 'assets/icons';
import { Size, Tooltip } from 'components';

type Props = {
	className?: string;
	hoverText?: string;
	spin?: boolean;
	icon: AssetIconType;
	size?: Size;
} & Omit<React.CSSProperties, 'width' | 'height'>;

export const Icon = (props: Props): JSX.Element => {
	const {
		className,
		spin = false,
		hoverText,
		size = Size.MICRO,
		icon,
		...style
	} = props;
	const SVG = icons[icon];

	return (
		<Tooltip content={hoverText}>
			<StyledSVG className={className} style={style} size={size} spin={spin}>
				<SVG />
			</StyledSVG>
		</Tooltip>
	);
};

const StyledSVG = styled.span<{ size: Size; spin: boolean }>`
	svg {
		${({ spin }) => spin && `animation: rotation 2s infinite linear;`}
		display: block;
		margin: 0 auto;
		min-height: ${({ size }) => size}px;
		max-height: ${({ size }) => size}px;
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
