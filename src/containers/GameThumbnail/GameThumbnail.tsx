import React from 'react';
import styled from 'styled-components';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { getGameThumbnail } from 'utils';
import { Size, Skeleton, Tooltip } from 'components';
import { GameTooltip, CommonProps } from 'containers';
import { useTheme, ColorTokens } from 'styles';

type Props = CommonProps & {
	game?: Game;
	gameId?: number;
};

export const GameThumbnail = (props: Props) => {
	const { colorTokens } = useTheme();
	const { game, gameId, size = Size.MEDIUM, title, isLoading, onClick } = props;
	const gameSrc = getGameThumbnail(gameId ?? game?.id);

	const gameThumbnail = isLoading ? (
		<Skeleton size={size} />
	) : (
		<img src={gameSrc} alt="Game" loading="lazy" />
	);

	return title ? (
		<Tooltip content={title}>
			<StyledGameThumbnail
				onClick={onClick}
				size={size}
				colorTokens={colorTokens}>
				{gameThumbnail}
			</StyledGameThumbnail>
		</Tooltip>
	) : (
		<GameTooltip game={game}>
			<StyledGameThumbnail
				onClick={onClick}
				size={size}
				colorTokens={colorTokens}>
				{gameThumbnail}
			</StyledGameThumbnail>
		</GameTooltip>
	);
};

const StyledGameThumbnail = styled.div.attrs(
	(
		props: Pick<Props, 'onClick'> & { size: Size; colorTokens: ColorTokens },
	) => {
		const { size, onClick } = props;
		const style: React.CSSProperties = {
			minWidth: `${size * 2}rem`,
			minHeight: `${size}rem`,
			maxWidth: `${size * 2}rem`,
			maxHeight: `${size}rem`,
			cursor: onClick ? 'pointer' : 'help',
		};
		return { style };
	},
)<Pick<Props, 'size'> & { size: Size; colorTokens: ColorTokens }>`
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	/* padding:var(--size-2); */
	border-radius: ${({ size }) =>
		size === Size.LARGE || size === Size.BIG
			? `var(--border-radius-8)`
			: `var(--border-radius-4)`};
	border: ${({ size, colorTokens }) =>
		`${size === Size.SMALL || size === Size.TINY ? 0.2 : 0.3}rem
		solid ${colorTokens['core-primary-bg']}`};

	img {
		width: 100%;
		height: 100%;
		border-radius: ${({ size }) =>
			size === Size.LARGE || size === Size.BIG
				? `var(--border-radius-8)`
				: `var(--border-radius-4)`};
		opacity: ${({ size }) =>
			size === Size.SMALL || size === Size.TINY ? '0.85' : '1'};
		&:hover {
			opacity: 1;
		}
	}
`;
