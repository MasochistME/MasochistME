import React from 'react';
import { Game, Tier } from '@masochistme/sdk/dist/v1/types';

import { getGameThumbnail } from 'utils';
import { useTiers } from 'sdk';
import { Flex, Wrapper } from 'components';
import { Basic, Image } from './styles';

type Props = {
	game?: Game;
};

export const GameHeader = (props: Props): JSX.Element => {
	const { game } = props;
	const { tiersData } = useTiers();

	const gameRating = tiersData.find((tier: Tier) => tier.id === game?.tier);
	const gameThumbnail = getGameThumbnail(game?.id);

	return (
		<Wrapper type="description">
			<div
				className="page-description"
				style={{ paddingBottom: '0', marginBottom: '0' }}>
				<Flex
					row
					align
					style={{ justifyContent: 'space-between', marginBottom: '10px' }}>
					<h1 style={{ margin: '0' }}>
						<a
							href={`https://steamcommunity.com/app/${game?.id}`}
							target="_blank"
							rel="noopener noreferrer">
							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
							{game?.title ?? 'Loading...'}
						</a>
					</h1>
					<div>
						<i
							className={gameRating?.icon ?? 'far fa-question-circle'}
							title={`This game is worth ${gameRating?.score ?? '?'} pts.`}></i>
					</div>
				</Flex>
				<Basic>
					<Image src={gameThumbnail} />
					<div style={{ fontSize: '1.3em', textAlign: 'center' }}>
						{game?.description ?? 'Loading...'}
					</div>
					<div />
				</Basic>
			</div>
		</Wrapper>
	);
};
