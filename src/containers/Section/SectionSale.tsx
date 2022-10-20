import React from 'react';
import styled from 'styled-components';
// import { Game } from '@masochistme/sdk/dist/v1/types';

import { getGameThumbnail } from 'utils';
import { Section, SaleBrick, SaleLink, SalePercentage } from 'containers';
import { Flex, Spinner } from 'components';
import { useCuratedGames } from 'sdk';

export const SectionSale = (): JSX.Element => {
	const { gamesData } = useCuratedGames();

	const gamesOnSale = gamesData.slice(0, 10).map(game => {
		const gameImg = getGameThumbnail(game.id);
		return (
			<SaleBrick
				key={`sale-${game.id}`}
				style={{ backgroundImage: `url(${gameImg})` }}>
				<SaleLink
					href={`https://store.steampowered.com/app/${game.id}`}
					target="_blank"
					rel="noopener noreferrer">
					{/* <SalePercentage>-{game.sale.discount}%</SalePercentage> */}
					<SalePercentage>-0%</SalePercentage>
				</SaleLink>
			</SaleBrick>
		);
	});

	// TODO Use games sale endpoint here!!!
	// const gamesOnSale = gamesData
	// 	// .filter(game => game.sale.onSale)
	// 	.filter(() => false)
	// 	.map((game: Game, index) => {
	// 		const gameImg = getGameThumbnail(game.id);
	// 		return (
	// 			<SaleBrick
	// 				key={`sale-${index}`}
	// 				style={{ backgroundImage: `url(${gameImg})` }}>
	// 				<SaleLink
	// 					href={`https://store.steampowered.com/app/${game.id}`}
	// 					target="_blank"
	// 					rel="noopener noreferrer">
	// 					{/* <SalePercentage>-{game.sale.discount}%</SalePercentage> */}
	// 					<SalePercentage>-0%</SalePercentage>
	// 				</SaleLink>
	// 			</SaleBrick>
	// 		);
	// 	});

	return (
		<Section
			fullWidth
			title="Games on sale"
			content={
				<StyledSectionSale align justify>
					{gamesOnSale.length ? gamesOnSale : <Spinner />}
				</StyledSectionSale>
			}
		/>
	);
};

export const StyledSectionSale = styled(Flex)`
	width: 100%;
	flex-wrap: wrap;
	gap: 8px;
`;
