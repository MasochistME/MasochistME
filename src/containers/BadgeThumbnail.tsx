import React from 'react';
import styled from 'styled-components';

import { Flex, Tooltip } from 'components';
import { colors } from 'shared/theme';
import { Badge } from '@masochistme/sdk/dist/v1/types';

export enum Size {
	SMALL = 16,
	MEDIUM = 32,
	LARGE = 64,
}

type Props = {
	badge: Badge;
	size?: Size;
	onClick?: () => void;
};

export const BadgeThumbnail = (props: Props) => {
	const { badge, size = Size.MEDIUM, onClick } = props;
	return (
		<Tooltip
			content={
				<Flex column>
					<span>
						{badge.points} pts - ${badge.name}
					</span>
					<span>{badge.description}</span>`
				</Flex>
			}>
			<StyledBadgeThumbnail
				onClick={onClick}
				size={size}
				src={badge.img}
				alt="Badge"
			/>
		</Tooltip>
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
	border-radius: 10px;
	border: 3px solid ${colors.superLightGrey};
	cursor: help;
`;

// import styled from 'styled-components';
// import { colors } from 'shared/theme';

// export const BadgeTile = styled.img`
// 	max-width: 24px;
// 	max-height: 24px;
// 	border: 3px solid black;
// 	border-radius: 3px;
// 	opacity: 0.7;
// 	&:hover {
// 		opacity: 1;
// 	}
// `;

// export const BigBadge = styled.img`
// 	border-radius: 10px;
// 	border: 3px solid ${colors.superLightGrey};
// 	box-sizing: border-box;
// 	width: 64px;
// 	height: 64px;
// 	min-width: 64px;
// 	min-height: 64px;
// 	cursor: pointer;
// 	box-shadow: 0 0 5px ${colors.superDarkGrey};
// 	margin: 10px;
// `;
