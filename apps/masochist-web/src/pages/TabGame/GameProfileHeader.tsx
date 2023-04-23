import React from 'react';
import styled from 'styled-components';
import { Game, Tier } from '@masochistme/sdk/dist/v1/types';

import { media, useTheme, ColorTokens } from 'styles';
import { getGameThumbnail } from 'utils';
import { useTiers } from 'sdk';
import { Flex, Icon, IconType, Tooltip, Size } from 'components';

type Props = {
	game?: Game;
};

export const GameProfileHeader = (props: Props): JSX.Element => {
	const { colorTokens } = useTheme();
	const { game } = props;
	const { tiersData } = useTiers();

	const gameTier = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const gameThumbnail = getGameThumbnail(game?.id);

	return (
		<StyledGameHeader row colorTokens={colorTokens}>
			<StyledGameHeaderThumbnail
				src={gameThumbnail}
				colorTokens={colorTokens}
			/>
			<StyledGameDetails column>
				<Flex row align justifyContent="space-between">
					<a
						href={`https://store.steampowered.com/app/${game?.id}`}
						target="_blank"
						rel="noopener noreferrer">
						<StyledGameTitle>
							<Icon
								icon="Steam"
								marginRight="var(--size-10)"
								size={Size.TINY}
							/>
							{game?.title ?? 'Loading...'}
						</StyledGameTitle>
					</a>
					<GameHeaderTier gameTier={gameTier} />
				</Flex>
				<div style={{ fontSize: 'var(--font-size-11)' }}>
					{game?.description ?? 'Loading...'}
				</div>
			</StyledGameDetails>
		</StyledGameHeader>
	);
};

const GameHeaderTier = ({ gameTier }: { gameTier?: Tier }) => {
	const gameIcon = (gameTier?.icon ?? 'QuestionCircle') as IconType;
	const gameTooltip = `This game is worth ${gameTier?.score ?? '—'} pts.`;
	return (
		<Tooltip content={gameTooltip}>
			<span>
				<Icon icon={gameIcon} size={Size.SMALL} />
			</span>
		</Tooltip>
	);
};

const StyledGameHeader = styled(Flex)<{ colorTokens: ColorTokens }>`
	max-width: 100%;
	padding: var(--size-8);
	gap: var(--size-16);
	justify-content: space-between;
	align-items: flex-start;
	background-color: ${({ colorTokens }) => colorTokens['core-tertiary-bg']}66;
`;

const StyledGameTitle = styled.h2`
	display: flex;
	margin: 0;
	align-items: center;
	font-size: var(--font-size-20);
`;

const StyledGameHeaderThumbnail = styled.img<{ colorTokens: ColorTokens }>`
	height: var(--size-128);
	min-height: var(--size-128);
	border-radius: var(--border-radius-10);
	border: var(--size-3) solid
		${({ colorTokens }) => colorTokens['core-tertiary-bg']};
	box-sizing: border-box;
	box-shadow: 0 0 var(--size-10)
		${({ colorTokens }) => colorTokens['core-tertiary-bg']};
`;

const StyledGameDetails = styled(Flex)`
	flex: 1 1 100%;
	gap: var(--size-12);
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;
