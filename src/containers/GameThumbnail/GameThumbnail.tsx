import React from 'react';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { Size, getGameThumbnail } from 'utils';
import { colors } from 'shared/theme';
import { Skeleton, Tooltip } from 'components';
import { GameTooltip, CommonProps } from 'containers';

type Props = CommonProps & {
	game?: Game;
};

export const GameThumbnail = (props: Props) => {
	const { game, size = Size.MEDIUM, title, isLoading, onClick } = props;
	const gameThumbnail = getGameThumbnail(game?.id);

	return title ? (
		<Tooltip content={title}>
			<StyledGameThumbnail onClick={onClick} size={size}>
				{isLoading ? (
					<Skeleton size={size} />
				) : (
					<img src={gameThumbnail} alt="Game" />
				)}
			</StyledGameThumbnail>
		</Tooltip>
	) : (
		<GameTooltip game={game}>
			<StyledGameThumbnail onClick={onClick} size={size}>
				{isLoading ? (
					<Skeleton size={size} />
				) : (
					<img src={gameThumbnail} alt="Game" />
				)}
			</StyledGameThumbnail>
		</GameTooltip>
	);
};

const StyledGameThumbnail = styled.div.attrs(
	(props: Pick<Props, 'onClick'> & { size: Size }) => {
		const { size, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: size * 2,
			minHeight: size,
			maxWidth: size * 2,
			maxHeight: size,
			cursor: onClick ? 'pointer' : 'help',
		};
		return { style };
	},
)<Pick<Props, 'size'> & { size: Size }>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	/* padding: 2px; */
	border-radius: ${({ size }) =>
		size === Size.LARGE || size === Size.BIG ? 8 : 4}px;
	border: ${({ size }) => (size === Size.SMALL || size === Size.TINY ? 2 : 3)}px
		solid ${colors.superDarkGrey};

	img {
		width: 100%;
		height: 100%;
		border-radius: ${({ size }) =>
			size === Size.LARGE || size === Size.BIG ? 8 : 4}px;
		opacity: ${({ size }) =>
			size === Size.SMALL || size === Size.TINY ? '0.85' : '1'};
		&:hover {
			opacity: 1;
		}
	}
`;
