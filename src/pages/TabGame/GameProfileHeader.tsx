import React from 'react';
import styled from 'styled-components';
import { Game, Tier } from '@masochistme/sdk/dist/v1/types';

import { media } from 'shared/theme';
import { getGameThumbnail } from 'utils';
import { useTiers } from 'sdk';
import { Flex, Tooltip } from 'components';
import { useTheme, ColorTokens } from 'styles';

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
					<h1 style={{ margin: '0' }}>
						<a
							href={`https://steamcommunity.com/app/${game?.id}`}
							target="_blank"
							rel="noopener noreferrer">
							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
							{game?.title ?? 'Loading...'}
						</a>
					</h1>
					<GameHeaderTier gameTier={gameTier} />
				</Flex>
				<div style={{ fontSize: '1.1em' }}>
					{game?.description ?? 'Loading...'}
				</div>
			</StyledGameDetails>
		</StyledGameHeader>
	);
};

const GameHeaderTier = ({ gameTier }: { gameTier?: Tier }) => {
	return (
		<Tooltip content={`This game is worth ${gameTier?.score ?? '?'} pts.`}>
			<i
				className={gameTier?.icon ?? 'far fa-question-circle'}
				style={{ fontSize: '2em' }}
			/>
		</Tooltip>
	);
};

const StyledGameHeader = styled(Flex)<{ colorTokens: ColorTokens }>`
	max-width: 100%;
	padding: 8px;
	gap: 16px;
	justify-content: space-between;
	align-items: flex-start;
	background-color: ${({ colorTokens }) => colorTokens['core-tertiary-bg']}66;
`;

const StyledGameHeaderThumbnail = styled.img<{ colorTokens: ColorTokens }>`
	height: 128px;
	min-height: 128px;
	border-radius: 10px;
	border: 3px solid ${({ colorTokens }) => colorTokens['core-tertiary-bg']};
	box-sizing: border-box;
	box-shadow: 0 0 10px ${({ colorTokens }) => colorTokens['core-tertiary-bg']};
`;

const StyledGameDetails = styled(Flex)`
	flex: 1 1 100%;
	gap: 12px;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;
